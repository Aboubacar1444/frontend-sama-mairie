import { logout } from "@/apis/auth-service";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, getUserProfile } from "@/firebase";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types/user";
import { signOut } from "firebase/auth";
import { Loader2, LogOutIcon, Mail, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [profile, setProfile] = useState<UserType | null>(null);
  
  const handleLogout = () => {
    setTimeout(() => {
      setLoggingOut(true);
      const response:any = async () => await logout();
      if (response.status === 1) {
        navigate('/auth/login');
        toast.success(response.message);
      }
      else {
        toast.error(response.message);
      }
    }, 3000);
  }


  // Set User info
  useEffect(() => {
    setProfile(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null);
  }, [profile]);


  if (loading) {
    return (
     <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
           <Loader2 className="h-11 w-11 animate-spin text-neutral-900" />
           <p className="mt-4 text-neutral-900 font-semibold animate-pulse text-xl">Loading...</p>
         </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full sm:w-10 sm:h-10 w-8 h-8 bg-gray-200/75 hover:bg-slate-200 focus-visible:ring-0 dark:bg-slate-700 dark:hover:bg-slate-600 border-0 cursor-pointer data-[state=open]:bg-gray-300 data-[state=open]:ring-4 data-[state=open]:ring-slate-300 dark:data-[state=open]:ring-slate-500 dark:data-[state=open]:bg-slate-600 text-primary font-bold hover:text-primary"
          )}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} className="rounded-full" />
          ) : (
            <>
              {profile?.firstname?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="sm:w-[300px] min-w-[250px] right-[40px] absolute p-4 rounded-2xl overflow-hidden shadow-lg"
        side="bottom"
        align="end"
      >
        <div className="py-3 px-4 rounded-lg bg-primary/10 dark:bg-primar flex items-center justify-between">
          <div>
            <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">
              {profile?.firstname || user?.displayName || "User Name"}
            </h6>
            <span className="text-sm text-neutral-500 dark:text-neutral-300">
              Admin
            </span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto scroll-sm pt-4">
          <ul className="flex flex-col gap-3">
            <li className="flex">
              <Link
                to={`/view-my-profile/${profile?.id}`}
                className="text-black dark:text-white hover:text-primary dark:hover:text-primary flex items-center gap-3 w-full"
              >
                <User className="w-5 h-5" /> Mon profil
              </Link>
            </li>
            {/* <li className="flex">
              <Link
                to="/email"
                className="text-black dark:text-white hover:text-primary dark:hover:text-primary flex items-center gap-3 w-full"
              >
                <Mail className="w-5 h-5" /> Inbox
              </Link>
            </li> */}
            {/* <li className="flex">
              <Link
                to="/company"
                className="text-black dark:text-white hover:text-primary dark:hover:text-primary flex items-center gap-3 w-full"
              >
                <Settings className="w-5 h-5" /> Settings
              </Link>
            </li> */}
            <li className="flex ms-[2px]">
              <Button
                variant="ghost"
                className={`!p-0 h-auto w-full justify-start font-normal !bg-transparent cursor-pointer dark:text-neutral-200 flex items-center gap-3 text-[16px] hover:text-red-600 focus:text-red-600 ${loggingOut ? 'text-red-600 focus:text-red-600' : 'text-black'}`}
                onClick={handleLogout}>
                <LogOutIcon className="size-5" />
                {loggingOut ? 'Deconnexion...' : "Se deconnecter"}
              </Button>
            </li>
          </ul>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
