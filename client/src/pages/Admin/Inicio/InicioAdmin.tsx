import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
function InicioAdmin() {
  const {
    fetchSemestres,
    hasLoadedSemestres,
    setGlobalLoading,
  } = useAppStore();

  useEffect(() => {
    const cargar = async () => {
      if (!hasLoadedSemestres) {
        setGlobalLoading(true);
        await fetchSemestres(); 
        setGlobalLoading(false);
      }
    };
    cargar();
  }, [fetchSemestres, hasLoadedSemestres, setGlobalLoading]);

  return <div>InicioAdmin</div>;
}

export default InicioAdmin;
