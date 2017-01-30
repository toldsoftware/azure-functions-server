import { Platform, setupBrowser } from '@told/platform/lib/';
import { resolveUrlClient } from './resolve-url';

setupBrowser();
Platform.urlResolver = resolveUrlClient;
