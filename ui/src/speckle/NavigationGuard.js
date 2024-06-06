import { SPECKLE_URL, exchangeAccessCode } from './SpeckleUtils.js';

export async function useNavigationGuard(location) {
  const currentPath = location;
  const query = getQueryParams()
  // Perform your "beforeEach" logic here
  console.log(`Navigating to ${currentPath}`)
  const access_code = query.get('access_code')
  console.log(`Access code : ${access_code}`)

  // If route contains an access code, exchange it
  if (access_code) {
    try{
      await exchangeAccessCode(access_code)
    }

    catch (error) {
      console.warn('Exchange failed', error)
    }
  }

}

function getQueryParams() {
    return new URLSearchParams(window.location.search);
}
