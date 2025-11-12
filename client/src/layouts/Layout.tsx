import { MobileDock } from "../components/layout/MobileDock";
import TopBar from "../components/layout/TopBar";
import Transition from "../components/layout/Transition";
import { useAppStore } from "../stores/useAppStore";

function Layout() {
  const {user} = useAppStore()
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* <GlobalLoader /> */}

      <TopBar user={user}/>

      <MobileDock user={user}/>
      <main className="container mx-auto px-6 md:px-8 lg:px-16 xl:px-20 py-7 md:py-8 pb-32 lg:pb-4">
        <Transition />
      </main>
    </div>
  );
}

export default Layout;
