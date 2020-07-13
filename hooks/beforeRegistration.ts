import { Logger } from '@vue-storefront/core/lib/logger'

export function beforeRegistration ({ config }) {
  if (config.klevu && config.klevu.ticket && config.klevu.cloudSearchHostURL) {
    // Init stuff here
  } else {
    Logger.warn(
      'Klevu extension is not working. Put the info in the config',
      'Klevu'
    )()
  }
}
