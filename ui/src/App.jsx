import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, onMount } from "solid-js";
import { getUserData, goToSpeckleAuthPage, speckleLogOut } from './speckle/SpeckleUtils';
import { useNavigationGuard } from './speckle/NavigationGuard';

export const [userData, setUserData] = createSignal(null);
export const [winlocation, setWinLocation] = createSignal(window.location.pathname)

function App() {
  
  onMount(async () => {
    await useNavigationGuard(winlocation());
    const data = await getUserData();
    setUserData(data);
  })

  return (
    <div className="flex flex-col w-screen h-screen place-items-center relative overflow-hidden" id='ft3d-app'>
      {/* NAV BAR START */}
      <div id='nav-bar' className='flex w-full h-18 max-h-18 bg-blue-700 p-3 justify-between'>
        { !userData() ? // If user data is null show login prompt
          <div className='flex flex-col place-items-center'>
            <button id='navbar-speckle-login' className='speckle-login' onClick={()=> goToSpeckleAuthPage() }>Login</button>
          </div>
          :
          <div className='flex flex-row gap-x-5 place-items-center'>
            <button id='navbar-speckle-logout' className='text-white font-medium text-lg' onClick={()=> SpeckleLogout() }>Logout</button>
            <div id='navbar-speckle-user' className='text-white font-medium text-2xl'> {userData().data.user.name} </div>
          </div>
          }
      </div>
      {/* NAV BAR END */}
      
      {/* ACTION BUTTONS START */}

      {/* ACTION BUTTONS END */}

    </div>
  );
}

export default App;
