import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function FeedPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Your Feed</h2>
        <Button size="sm">Create Post</Button>
      </div>

      <div className="space-y-6">
        {/* Mock Post 1 */}
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=felix" />
              <AvatarFallback>FD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Felix Dude</span>
              <span className="text-muted-foreground text-xs">2 hours ago</span>
            </div>
            <Button className="ml-auto" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Just deployed my new side project! built with Next.js 14 and
              Tailwind. It's properly amazing how fast you can ship these days.
              🚀 #webdev #shipping
            </p>
            <div className="mt-4 flex h-64 w-full items-center justify-center rounded-md bg-accent/20 text-muted-foreground">
              Mock Image Placeholder
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-border/50 border-t p-2">
            <Button
              className="gap-2 text-muted-foreground"
              size="sm"
              variant="ghost"
            >
              <Heart className="h-4 w-4" />
              <span>24</span>
            </Button>
            <Button
              className="gap-2 text-muted-foreground"
              size="sm"
              variant="ghost"
            >
              <MessageCircle className="h-4 w-4" />
              <span>5</span>
            </Button>
            <Button
              className="gap-2 text-muted-foreground"
              size="sm"
              variant="ghost"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Mock Post 2 */}
        <Card className="overflow-hidden border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Sarah Jenkins</span>
              <span className="text-muted-foreground text-xs">5 hours ago</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Anyone else feeling the pressure of AI development speed? Trying
              to keep up is a full time job in itself! 😅
            </p>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-border/50 border-t p-2">
            <Button
              className="gap-2 text-muted-foreground"
              size="sm"
              variant="ghost"
            >
              <Heart className="h-4 w-4" />
              <span>142</span>
            </Button>
            <Button
              className="gap-2 text-muted-foreground"
              size="sm"
              variant="ghost"
            >
              <MessageCircle className="h-4 w-4" />
              <span>38</span>
            </Button>
            <Button
              className="gap-2 text-muted-foreground"
              size="sm"
              variant="ghost"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
