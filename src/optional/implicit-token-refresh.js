import { epochSeconds } from '../helpers/time';
import auth from '../auth';

/*
 * Validate the auth token for expiry, attempting to refresh it
 * if we have the refresh token.
 */
export default async function implicitTokenRefresh() {
  if (epochSeconds() >= auth.tokens?.expires) {
    if (auth.tokens?.refresh) {
      try {

        // Let's implicitly refresh the access token using the refresh token.
        await auth.refresh();
      } catch (error) {

        // The refresh token is not valid.
        return Promise.reject(`Unable to refresh expired token: ${error}`);
      }
    } else {

      // We are forced to reject as our access token has expired and we
      // do not have a refresh token.
      return Promise.reject('Access token expired');
    }
  }
}