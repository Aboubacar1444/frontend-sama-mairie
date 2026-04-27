import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/layouts/Breadcrumb";
import EditProfileTabContent from "./components/EditProfileTabContent";
import ViewProfileSidebar from "./components/ViewProfileSidebar";
import ChangePasswordTabContent from "./components/ChangePasswordTabContent";
import NotificationPasswordTabContent from "./components/NotificationPasswordTabContent";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { UserType } from "@/types/user";
import { useEffect, useState } from "react";
import { getUserById } from "@/apis/users-service";


const ViewConnectedProfile = () => {
    const [user, setUser] = useState<UserType>({} as UserType);

    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    // if (!connectedUser || Object.keys(connectedUser).length === 0) {
    //     return <Navigate to="/auth/login" />;
    // }
    const fetchUserData = async (id: string) => {
        const response = await getUserById({ id: parseInt(id) });
        if (response.status === 1 && response.body) {
            const userData = Array.isArray(response.body.items) ? response.body.items[0] : response.body.items;
            setUser(userData as any);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData(userId);
        }
    }, [userId]);

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
                                <TabsList className='active active-gradient bg-transparent dark:bg-transparent rounded-none h-[50px]'>
                                    <TabsTrigger value="editProfile" className='py-2.5 px-4 font-semibold text-sm inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 data-[state=active]:bg-gradient border-0 border-t-2 border-neutral-200 dark:border-neutral-500 data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-[0] data-[state=active]:shadow-none cursor-pointer'>
                                        Modifier mes informations
                                    </TabsTrigger>
                                    <TabsTrigger value="changePassword" className='py-2.5 px-4 font-semibold text-sm inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 data-[state=active]:bg-gradient border-0 border-t-2 border-neutral-200 dark:border-neutral-500 data-[state=active]:border-primary dark:data-[state=active]:border-primary rounded-[0] data-[state=active]:shadow-none cursor-pointer'>
                                        Changer le mot de passe
                                    </TabsTrigger>
                                   
                                </TabsList>

                                <TabsContent value="editProfile">
                                    <EditProfileTabContent user={user} refreshUser={() => userId ? fetchUserData(userId) : Promise.resolve()} />
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
