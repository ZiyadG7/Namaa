"use server"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { createClient } from "@/utils/supabase/server";
import { FaRegCircleUser } from "react-icons/fa6";


export async function UserInformation({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="flex flex-col items-center text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{user?.user_metadata?.full_name || "Guest"}</CardTitle>
          <div>
            {user?.user_metadata?.picture ? (
              <img
                src={user.user_metadata.picture}
                alt={`${user.user_metadata.name}'s avatar`}
                className="w-24 h-24 rounded-full mt-2"
              />
            ) : (
              <FaRegCircleUser className="w-24 h-24 rounded-full mt-2" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div><strong>Email: </strong>{user?.email || "Guest"}</div>
        </CardContent>
      </Card>
    </div>
  )
}
