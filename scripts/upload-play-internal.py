"""Upload only to the Google Play internal track. Never touches production.
Requires google-auth and requests; credentials are supplied by a temporary file.
"""
import argparse
from pathlib import Path
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--credentials', required=True)
    parser.add_argument('--bundle', required=True)
    parser.add_argument('--package', default='com.prego.app')
    parser.add_argument('--build-number', required=True, type=int)
    parser.add_argument('--version', required=True)
    args = parser.parse_args()
    if args.package != 'com.prego.app':
        raise SystemExit('Package differs from this repository. Verify bundle IDs before upload.')
    credentials = service_account.Credentials.from_service_account_file(
        args.credentials, scopes=['https://www.googleapis.com/auth/androidpublisher'])
    client = AuthorizedSession(credentials)
    base = f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{args.package}/edits'

    def request(method, url, **kwargs):
        response = client.request(method, url, timeout=300, **kwargs)
        if not response.ok:
            # Do not echo service-account contents, OAuth tokens or request bodies.
            raise RuntimeError(f'Google Play returned HTTP {response.status_code}. Check package registration, app setup, upload key and service-account permissions.')
        return response.json() if response.content else {}

    edit_id = request('POST', base, json={})['id']
    committed = False
    try:
        with Path(args.bundle).open('rb') as bundle:
            upload = request('POST', f'https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/{args.package}/edits/{edit_id}/bundles?uploadType=media',
                             data=bundle, headers={'Content-Type': 'application/octet-stream'})
        code = upload['versionCode']
        if int(code) != args.build_number:
            raise RuntimeError('Uploaded bundle version does not match the requested build.')
        request('PUT', f'{base}/{edit_id}/tracks/internal', json={
            'track': 'internal', 'releases': [{
                'name': f'Prego usability beta {args.version} ({code})',
                'versionCodes': [str(code)], 'status': 'completed',
                'releaseNotes': [{'language': 'en-CA', 'text': 'Usability beta: explore navigation, accessibility, offline use and private data controls. Guided workouts and purchases remain unavailable pending review.'}]
            }]})
        request('POST', f'{base}/{edit_id}:validate')
        request('POST', f'{base}/{edit_id}:commit')
        committed = True
        print(f'Committed build {code} to Google Play internal testing. Verify processing and tester access in Play Console.')
    finally:
        if not committed:
            client.delete(f'{base}/{edit_id}', timeout=30)
        client.close()


if __name__ == '__main__':
    main()
