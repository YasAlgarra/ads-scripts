/**
 * Configuration to be used for the Link Checker.
 */

CONFIG = {
  // URL of the spreadsheet template.
  // This should be a copy of https://docs.google.com/spreadsheets/d/1iO1iEGwlbe510qo3Li-j4KgyCeVSmodxU6J7M756ppk/copy.
  'spreadsheet_url': 'https://docs.google.com/spreadsheets/d/1OIt69g7IEy-azau4p1uDKkUFOOFqHyHptH73PUWLswk/edit#gid=1280565513',

  // Array of addresses to be alerted via email if issues are found.
  'recipient_emails': [
    'petri.vangaalen@labelnone.com'
  ],

  // Label to use when a link has been checked. Label will be created if it doesn't exist.
  'label': 'LinkChecker_Done',

  // Number of seconds to sleep after each URL request. If your URLs are
  // all on one or a few domains, use this throttle to reduce the load that the
  // script imposes on your web server(s).
  'throttle': 0,

  // Number of seconds before timeout that the script should stop checking URLs
  // to make sure it has time to output its findings.
  'timeout_buffer': 120,

  'advanced_options': {
    /**
     * Parameters controlling the script's behavior after hitting a UrlFetchApp
     * QPS quota limit.
     */
    'quota_config': {
      'INIT_SLEEP_TIME': 250,
      'BACKOFF_FACTOR': 2,
      'MAX_TRIES': 5
    }
  }
};
