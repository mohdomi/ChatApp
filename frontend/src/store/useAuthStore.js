import {create} from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.NODE === "development" ? "http://localhost:3000" : "/api"

export const useAuthStore = create((set, get)=>({
    authUser:null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    onlineUsers : [],
    isCheckingAuth:true,
    socket : null,

    checkAuth : async()=>{

        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        }catch(err)
        {
            set({authUser:null})
            console.log("Some error in useAuthStore")
        } finally{

            set({isCheckingAuth : false})

        }

    },

    signup: async(data)=>{

        set({isSigningUp:  true})
        try{

            const res = await axiosInstance.post("/auth/signup" , data);
            set({authUser : res.data})
            toast.success("Account Connected Successfully");

            get().connectSocket();

        }catch(err){
            toast.error(err.response.data.message)
        }finally{
            set({isSigningUp: false})
        }

    },

    logout : async ()=>{

        try{
           await axiosInstance.post("auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(error){

            toast.error(error.response.data.message);


        }
    },

    login : async (data)=>{
        set({isLoggingIn : true})
      try{  
        const res = await axiosInstance.post("auth/login" , data);
        set({authUser : res.data});
        toast.success("User logged in");
        get().connectSocket();
        }catch(err){
            toast.error(err.response.data.message);
        }finally{

            set({isLoggingIn : false})

        }


    },


    updateProfile : async (data)=>{
        set({
            isUpdatingProfile : true
        });

        try{
            const res = await axiosInstance.put("/auth/update_profile" , data);
            set({
                authUser : res.data
            });
            toast.success("Profile updated successfully");

        }catch(err){
            console.error(err);
            toast.error("Profile Not Updated")

        }finally{
            set({
                isUpdatingProfile : false
            })
        }
    },

    connectSocket : ()=>{
        const {authUser} = get();
        // if(!authUser || get().socket?.connected) return

        const socket = io(BASE_URL , {
            query : {
                userId : authUser._id
            }
        })
        socket.connect();

        set({socket : socket});

        socket.on("getOnlineUsers" , (userIds)=>{
            set({onlineUsers : userIds})
        })
    },

    disconnectSocket : ()=>{

        if(get().socket?.connected) { get().socket.disconnect()};

    }

}))