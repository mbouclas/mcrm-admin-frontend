<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user } from "../stores";
  import { AuthService } from "./auth.service";

  const navigate = useNavigate();
  const location = useLocation();

  let username;
  let password;

  async function  handleSubmit() {
    $user = { username, password };
    if(username === '' || password ==='') {
      alert("Enter username/password")
      return;
    }
    const res = await new   AuthService().login(username, password);
    if(!res.success) {
      alert(res.reason);
      return;
    }
    const from = ($location.state && $location.state.from) || "/";
    navigate(from, { replace: true });
  }
</script>
<div class="absolute  hidden  py-3 px-3 lg:flex  top-0 right-1">
  <a href="/" class="h-8 w-8 text-white">
   <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/></svg>
  </a>
</div>
<form 
on:submit|preventDefault={handleSubmit}
class="w-full mt-16 lg:w-[28%] mx-auto  min-h-screen relative flex flex-col items-center justify-center">
                   
                   <div class=" min-h-64 min-h-[80vh] flex flex-col w-full rounded bg-gray-secondary">
                     <div class="h-28 rounded-t w-full bg-dark-blue">
                       <div class="flex items-center justify-between  p-2 text-sm text-blue-500">
                         <div class="flex flex-col  px-2 text-sm text-primary">
                          <h4 class="font-bold mb-2 text-sm">Welcome Back!</h4>
                          <p class="text-xs">Sign in to Continue!</p>
                         </div>


                          <img class="h-20 w-32 object-fit" src="http://skote-v-dark.svelte.themesbrand.com/assets/images/profile-img.png" alt="">
                       </div>  
                    </div>

                    <div class="absolute h-16 w-16 top-[15%] rounded-full bg-gray-secondary left-4 flex items-center justify-center">
                     <img 
                     src="http://skote-v-dark.svelte.themesbrand.com/assets/images/logo-light.svg" 
                     class="w-8 h-8 object-fit rounded-full"
                     alt="">
                    </div>
                    <div class="flex-grow pt-12 flex flex-col  justify-between w-full px-6 lg:px-8 ">

                      <div class="group flex flex-col text-gray-500  w-full">
                        <label class="text-sm text-left font-semibold" for="email">Email</label>
                        <input type="text"
                        bind:value={username} 
                        id={username} 
                        placeholder="email"
                        class="w-full mt-1 w-full px-3 py-2 text-sm bg-gray-secondary border border-gray-700 rounded" >
                      </div>
                  
                      <div class="group flex flex-col text-gray-500  w-full">
                        <label class="text-sm text-left  w-full  font-semibold" for="passoword">Password</label>
                        <input type="password"
                        bind:value={password} 
                        id={password} 
                        placeholder="Password"

                        class="w-full mt-2 w-full px-3 py-2 text-sm bg-gray-secondary border border-gray-700 rounded" >
                      </div>
                     <div class="group flex items-center text-gray-500 mb-2 w-full gap-2 relative">
                       <input type="checkbox" name="" class="h-4 w-4" id="remember">
                       <label class="text-sm  " for="remember">Remember me!</label>

                     </div>

                     <div class="w-full py-2">
                       <button class="bg-primary w-full px-3 py-2 rounded hover:bg-opacity-80 text-white">Login</button>
                     </div>

                     <div class="flex w-full flex-col items-center justify-center">
                       <h4 class="text-sm font-medium text-white mb-3 ">Sign in With</h4>
                       <div class=" flex gap-4 pb-3">
                         <div class=" ">
                           <img src="https://cdn.worldvectorlogo.com/logos/facebook-3-2.svg" class="h-8 w-8 rounded-full " alt="">
                         </div>
                         <div class=" h-8 w-8 rounded-full flex items-center justify-center text-white bg-[#50A5F1]">
                           <svg class="fill-current h-4 w-4" focusable="false"  aria-hidden="true" viewBox="0 0 24 24" data-testid="TwitterIcon" aria-label="fontSize large"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>
                         </div>

                         <div class=" h-8 w-8 flex items-center justify-center rounded-full bg-red-600 text-white text-base font-semibold">
                           G
                         </div>

                       </div>

                       <div class="flex gap-2 items-center text-gray-300 mb-3">
                         <svg class="stroke-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                         <span class="text-sm">Forgot password!</span>
                       </div>
                     </div>

                    </div>
                   </div>
                   <!-- END USER CARD -->

             <div class="footer flex items-center flex-col gap-4 my-4 jusfify-center">
               <p class="text-gray-200 text-[13px] ">Don't have an account? <a href="/" class="text-blue-500">Signup now!</a></p>
               <span class="font-light  text-gray-200 text-xs">© 2022 Skote. Crafted with  by Themesbrand</span>
             </div>
</form>
