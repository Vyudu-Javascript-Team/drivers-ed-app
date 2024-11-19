import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Recent Graduate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "The story-based learning approach made studying for my driver's test engaging and fun. I passed on my first try!",
  },
  {
    name: "Michael Chen",
    role: "Student",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    content: "The interactive practice tests really helped me understand the material. The gamification kept me motivated.",
  },
  {
    name: "Emily Rodriguez",
    role: "New Driver",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    content: "I love how the content is tailored to my state's requirements. The achievement system makes learning fun!",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={testimonial.image} />
              <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
          <blockquote className="mt-4 text-muted-foreground">
            "{testimonial.content}"
          </blockquote>
        </Card>
      ))}
    </div>
  );
}