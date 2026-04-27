import UserGridBgImageHere from '@/assets/images/user-grid/user-grid-bg1.png';
import UserGridImageHere from '@/assets/images/user-grid/user-grid-img14.png';
import type { UserType } from '@/types/user';
import { formatDateToFrench } from '@/utils/date-formatter';


const ViewProfileSidebar = ({ user }: { user: any }) => {
    const IMAGE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
    return (
        <div className="user-grid-card relative border border-slate-200 dark:border-slate-600 rounded-2xl overflow-hidden bg-white dark:bg-[#273142] h-full">
            <img src={`${UserGridBgImageHere}`} alt="" className="w-full object-fit-cover" />
            <div className="pb-6 ms-6 mb-6 me-6 -mt-[100px]">
                <div className="text-center border-b border-slate-200 dark:border-slate-600">  
                    <img src={` ${IMAGE_URL}/${user.photo}`} alt="" className="border br-white border-width-2-px w-200-px h-[200px] rounded-full object-fit-cover mx-auto" referrerPolicy='no-referrer' />
                    <h6 className="mb-0 mt-4">{user.firstname} {user.lastname}</h6>
                    <span className="text-neutral-500 dark:text-neutral-300 mb-4">{user.email}</span>
                </div>
                <div className="mt-6">
                    <h6 className="text-xl mb-4">Informations personnelles</h6>
                    <ul>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200">Nom complet</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: {user.firstname} {user.lastname}</span>
                        </li>
                       
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Numéro de téléphone</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: {user.phone}</span>
                        </li>
                        
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Fonction</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: {user.roles}</span>
                        </li>

                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Créé le</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: {formatDateToFrench(user.createdAt)}</span>
                        </li>

                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Dernière connexion</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: {formatDateToFrench(user.lastLogin)}</span>
                        </li>
                        
                        <li className="flex items-center gap-1">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Bio</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: {user.bio}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileSidebar;