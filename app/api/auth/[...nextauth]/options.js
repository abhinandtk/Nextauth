import GIthubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
