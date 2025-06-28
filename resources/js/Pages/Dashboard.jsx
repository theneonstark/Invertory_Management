import { DashboardPage } from '@/Components/dashboard-page';
import { Head } from '@inertiajs/react';

export default function Dashboard({userorders}) {
  console.log(userorders);
    return (
      <>
       <DashboardPage userorders={userorders}/>
      </>
    );
}
