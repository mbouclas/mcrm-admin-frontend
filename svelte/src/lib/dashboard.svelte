
<script>
      import SideBar from '../components/SideBar.svelte'
      import TopHeader from '../components/TopHeader.svelte'
      import BreadCrumb from "../components/BreadCrumb.svelte";
      import UserCard from "../components/UserCard.svelte";
      import PaymentsCard from "../components/PaymentCard.svelte";
      import SocialCard from "../components/SocialCard.svelte";
      import TotalCard from "../components/TotalCard.svelte";
      import Transactions from "../components/Transactions.svelte";


</script>
      <!-- START THE SIDEBAR-->
          <SideBar />
      <!-- END THE SIDEBAR-->
    
    
      <!-- START THE MAIN SECTION -->
        <main class="lg:ml-64">
            <!-- START THE HEADER -->
            <TopHeader />
            <!-- END THE HEADER -->
    
    
            <!-- START CONTENT -->
            <section class="p-4">
                  <BreadCrumb />
       
       
                     <div class="container mx-auto">
                       <div class="w-full flex flex-wrap gap-4 lg:flex-nowrap">
                           <div class="w-full lg:w-1/3 p-4">
                           <UserCard />
       
                           <PaymentsCard />
                           <SocialCard />
                           </div>
                           <div class="flex-1 p-4">
                              <div class=" w-full flex flex-col lg:flex-row justify-between gap-4">
                             <TotalCard />
                             <TotalCard />
                             <TotalCard />
                              </div>
                           </div>
                       </div>
                   </div>
       
                   <Transactions />
                </section>
               <!-- END CONTENT -->
    
     
        </main>
      <!-- END MAIN SECTION -->
