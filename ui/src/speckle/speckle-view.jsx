import { createSignal, onMount } from "solid-js";
import { Viewer, DefaultViewerParams, SpeckleLoader } from "@speckle/viewer";
import { CameraController, MeasurementsExtension, SelectionExtension } from "@speckle/viewer";
import { SPECKLE_URL, TOKEN } from "./SpeckleUtils";
import { modelName, streamId } from "../App";

export const [speckleLoader, setSpeckleLoader] = createSignal(null);
export const [speckleViewer, setSpeckleViewer] = createSignal(null);

// Loads model from stream id and commit id if user is logged in. Creates loader if no loader exists, or uses existing loader to load model.
export async function loadModel(){

  if (!streamId() || !modelName()){
    console.error("There is either no stream or model selected.")
    return
  }

  var models = await speckleFetch(streamQuery(streamId()), token);
  console.log(models)

  // url = `${SPECKLE_URL}/projects/${streamId()}`
  let token = localStorage.getItem(TOKEN)
  if (token){
    var models = await speckleFetch(streamQuery(streamId()), token);
    console.log(models)

    // // LOAD SPECKLE MODEL
    // const loader = new SpeckleLoader(
    //   speckleViewer().getWorldTree(),
    //   url,
    //   token
    // );
  
    // setSpeckleLoader(loader);
    // await speckleViewer().loadObject(speckleLoader(), 1, true);
  }

  else {
    console.warn("Not logged into Speckle!");
  }

}

async function initViewer() {
  /** Get the HTML container */
  const container = document.getElementById("speckle-viewer");

  /** Create Viewer instance */
  const viewer = new Viewer(container, DefaultViewerParams);
  setSpeckleViewer(viewer)
  /** Initialise the viewer */
  await speckleViewer().init();

  /** Add the stock camera controller extension */
  speckleViewer().createExtension(CameraController);

  /** Add the measurement tool */
  // viewer.createExtension(MeasurementsExtension);

  speckleViewer().createExtension(SelectionExtension);

}

function SpeckleViewer() {
  
  onMount(() => {
    initViewer()
  })

  return (
    <div className="z-0 w-1/3 h-full" id='speckle-viewer'></div>
  );
}

export default SpeckleViewer;
