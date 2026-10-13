"""Offline contract checks; no store account or network is used."""
import importlib.util
import contextlib
import io
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import patch

# Minimal provider module fixtures let tests run without installing cloud SDKs.
modules = ['google', 'google.oauth2', 'google.oauth2.service_account', 'google.auth', 'google.auth.transport', 'google.auth.transport.requests']
for name in modules:
    sys.modules.setdefault(name, types.ModuleType(name))
sys.modules['google.oauth2.service_account'].Credentials = type('Credentials', (), {'from_service_account_file': staticmethod(lambda *args, **kwargs: object())})
sys.modules['google.auth.transport.requests'].AuthorizedSession = object
spec = importlib.util.spec_from_file_location('upload_play', Path(__file__).parents[1] / 'upload-play-internal.py')
upload = importlib.util.module_from_spec(spec)
spec.loader.exec_module(upload)

class Reply:
    ok = True
    content = b'{}'
    status_code = 200
    def __init__(self, data): self.data = data
    def json(self): return self.data

class Client:
    def __init__(self, code=2):
        self.calls = []
        self.deleted = False
        self.code = code
    def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        return Reply({'versionCode': self.code} if '/bundles?' in url else {'id': 'test-edit'})
    def delete(self, *args, **kwargs): self.deleted = True
    def close(self): pass

class UploadTests(unittest.TestCase):
    def invoke(self, client, package='com.prego.app'):
        args = ['upload-play', '--credentials', 'fixture.json', '--bundle', __file__, '--package', package, '--build-number', '2', '--version', '1.0.0']
        with patch.object(sys, 'argv', args), patch.object(upload, 'AuthorizedSession', return_value=client), contextlib.redirect_stdout(io.StringIO()):
            upload.main()
    def test_internal_track_only_and_validate_before_commit(self):
        client = Client()
        self.invoke(client)
        track = next(call for call in client.calls if '/tracks/' in call[1])
        self.assertTrue(track[1].endswith('/tracks/internal'))
        self.assertEqual(track[2]['json']['track'], 'internal')
        self.assertEqual(track[2]['json']['releases'][0]['versionCodes'], ['2'])
        self.assertTrue(client.calls[-2][1].endswith(':validate'))
        self.assertTrue(client.calls[-1][1].endswith(':commit'))
        self.assertFalse(client.deleted)
    def test_mismatched_build_deletes_edit_and_never_publishes(self):
        client = Client(code=9)
        with self.assertRaises(RuntimeError): self.invoke(client)
        self.assertTrue(client.deleted)
        self.assertFalse(any('/tracks/' in url or url.endswith(':commit') for _, url, _ in client.calls))
    def test_other_package_is_rejected_before_network(self):
        client = Client()
        with self.assertRaises(SystemExit): self.invoke(client, package='other.app')
        self.assertEqual(client.calls, [])

if __name__ == '__main__': unittest.main()
