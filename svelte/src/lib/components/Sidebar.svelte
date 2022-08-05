  <script>
    import SidebarLayout from '../layouts/SidebarLayout.svelte'
    let sidebar_show = true;
    let lists =[
      {
        name:'Catalogue',
        url:'/catalogue',
        icon:'/icons/catalogue.svg',
        sub_list:[
          {
            name:'Products',
            url:'/catalogue/products'
          },
          {
            name:'Categories',
            url:'/catalogue/categories'
          },
          {
            name:'Manufacturers',
            url:'/catalogue/manufacturers'
          }
        ]
      },
      {
        name:'Orders',
        url:'/orders',
        icon:'/icons/orders.svg',
      },
      {
        name:'Customers',
        url:'/customers',
        icon:'/icons/customers.svg',
      },
      {
        name:'CMS',
        url:'/cms',
        icon:'/icons/cms.svg',
        sub_list:[
          {
            name:'Pages',
            url:'/cms/pages'
          },
          {
            name:'Categories',
            url:'/catalogue/categories'
          },
          {
            name:'Settings',
            url:'/cms/settings'
          }
        ]
      },
      {
        name:'Orders',
        url:'/orders',
        icon:'/icons/orders.svg',
      }
    ]
  </script>
  <!-- START THE SIDEBAR-->
  <SidebarLayout bind:show={sidebar_show}>
    <div class="logo flex w-full justify-center items-center py-2 px-3">
      <img src="http://skote-v-dark.svelte.themesbrand.com/assets/images/logo-light.png" class=" object-contain h-6 w-20" alt="" srcset="">
    </div>
 
    <div class="nav-content mt-8 text-">
           <div class="item">
           
             <ul class="flex flex-col space-y-4">
               <li class="text-gray-400 uppercase  font-medium text-xs mb-4">  Menu</li>    
              {#each lists as list}

              <li>
                <a href="{list.url}" class="w-full flex justify-between  items-center flex-wrap text-sm">
                  <div class="flex-1 flex items-center flex-wrap gap-3 ">
                   <img src="{list.icon}" class="h-5 w-5" alt="" srcset="">
                   <span >{list.name}</span>
                  </div>
 
                  {#if list?.sub_list}
                  <!-- START DROPDOWN MENU -->
                 <ul class="w-full h-auto bg-gray-secondary flex flex-col text-sm gap-3 text-xs mt-4 pl-8">
                  {#each list.sub_list as sublist_item}
                    <li class="text-gray-500"><a href="{sublist_item.url}" class="side-nav-link-ref" > {sublist_item.name}</a></li>
                  {/each}
                  <!-- <li class="mm-active"><a href="/catalogue/products" aria-current="page"  class="side-nav-link-ref ">Products</a></li> -->
                </ul>
                <!-- END DROPDOWN MENU -->
                  {/if}
                 <!-- <span class="bg-primary text-white rounded px-2 text-xs rounded-2xl  float-right">04</span>  -->
               </a>
               </li>
              {/each}          
             </ul>
           </div>
    </div>
  </SidebarLayout>
   <!-- END THE SIDEBAR-->