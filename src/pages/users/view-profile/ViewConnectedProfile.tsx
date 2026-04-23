import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/layouts/Breadcrumb";
import EditProfileTabContent from "./components/EditProfileTabContent";
import ViewProfileSidebar from "./components/ViewProfileSidebar";
import ChangePasswordTabContent from "./components/ChangePasswordTabContent";
import NotificationPasswordTabContent from "./components/NotificationPasswordTabContent";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import type { UserType } from "@/types/user";
import { useEffect, useState } from "react";


const ViewConnectedProfile = () => {
    const [user, setUser] = useState<UserType>({} as UserType);

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const userId = params.get("userId");
    const connectedUser = JSON.parse(localStorage.getItem("user") || "{}") as UserType;
    // if (!connectedUser || Object.keys(connectedUser).length === 0) {
    //     return <Navigate to="/auth/login" />;
    // }
    const fetchUserData = async (id: string) => {
         setUser(connectedUser);
    }
    useEffect(() => {
        userId && fetchUserData(userId);
    }, []);

    return (
        <>
            <Breadcrumb title="Details de l'utilisateur" text="Details de l'utilisateur" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4">
                    <ViewProfileSidebar user={user} />
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <Card className="card">
                        <CardContent className="px-0">
                            <Tabs defaultValue="Details de l'utilisateur" className="gap-4">
                                <TabsList className='active-gradient bg-transparent dark:bg-transparent rounded-none h-[50px]'>
                                    <TabsTrigger value="editProfile" className='py-2.5 px-4 font-semibold text-sm inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 data-[state=active]:bg-gradient border-0 border-t-2 border-neutral-200 dark:border-neutral-500 data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-[0] data-[state=active]:shadow-none cursor-pointer'>
                                        Modifier mes informations
                                    </TabsTrigger>
                                    <TabsTrigger value="changePassword" className='py-2.5 px-4 font-semibold text-sm inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 data-[state=active]:bg-gradient border-0 border-t-2 border-neutral-200 dark:border-neutral-500 data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-[0] data-[state=active]:shadow-none cursor-pointer'>
                                        Changer le mot de passe
                                    </TabsTrigger>
                                    {/* <TabsTrigger value="NotificationPassword" className='py-2.5 px-4 font-semibold text-sm inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 data-[state=active]:bg-gradient border-0 border-t-2 border-neutral-200 dark:border-neutral-500 data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-[0] data-[state=active]:shadow-none cursor-pointer'>
                                        Notification Password
                                    </TabsTrigger> */}
                                </TabsList>

                                <TabsContent value="editProfile">
                                    <EditProfileTabContent user={user} />
                                </TabsContent>
                                <TabsContent value="changePassword">
                                    <ChangePasswordTabContent />
                                </TabsContent>
                                {/* <TabsContent value="NotificationPassword">
                                    <NotificationPasswordTabContent />
                                </TabsContent> */}
                            </Tabs>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
};

export default ViewConnectedProfile;