import GIthubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt"

export const options={
    providers:[
        GIthubProvider({
             profile(profile){
                console.log("Profile Github: ",profile)
                let userRole="Github User"
                if(profile?.email=="abhinandtk69@gmail.com"){
                    userRole="admin"
                }
                return {
                    ...profile,
                    role:userRole
                }
             },
             clientId:process.env.GITHUB_ID,
             clientSecret:process.env.GITHUB_SECRET
        }),
       GoogleProvider({
            profile(profile){
               console.log("Profile Google: ",profile)
               let userRole="Google User"
            //    if(profile?.email=="abhinandtk69@gmail.com"){
            //        userRole="admin"
            //    }
               return {
                   ...profile,
                   id:profile.sub,
                   role:userRole
               }
            },
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
       }),CredentialsProvider({
        name:"Credentials",
        credentials:{
            email:{
                label:"email:",
                type:"text",
                placeholder:"your-email",

            },
            password:{
                label:"password:",
                type:"password",
                placeholder:"your-password",
                
            }
        },async authorize(credentials){
            try {
                const foundUser=await User.findOne({email:credentials.email}).lean().exec()
                if(foundUser){
                    console.log("User Exists")
                }
                const match=await bcrypt.compare(
                    credentials.password,
                    foundUser.password
                )
                if(match){
                    console.log("Good pass")
                    delete foundUser.password
                    foundUser["role"]="Unverified Email"
                    return foundUser
                }
                
            } catch (error) {
                console.log(error);
                
            }
            return null
        }
       })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
              token.role = user.role;
            }
            console.log("JWT Token: ", token);  // Log to see if role is present
            return token;
          },
        async session({session,token}){
            if(session?.user){
                session.user.role=token.role
            } 
            console.log("session token======== : ",session)
            return session
        }
    },
    
}
