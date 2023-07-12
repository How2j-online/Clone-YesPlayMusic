import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "@/assets/css/nprogress.css";
const nProgress = NProgress;
const useNProgress = () => {
  nProgress.configure({ showSpinner: false, parent: "body" });

  const start = () => {
    nProgress.start();
  };

  const done = () => {
    nProgress.done();
  };

  return {
    start,
    done
  };
};

export default useNProgress;
