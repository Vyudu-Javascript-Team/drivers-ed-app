import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Eye,
  FileQuestion
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const tests = [
  {
    id: "TEST001",
    title: "Road Signs Practice Test",
    category: "Signs",
    questions: 25,
    difficulty: "Beginner",
    status: "Published",
    lastUpdated: "2024-01-15",
  },
  {
    id: "TEST002",
    title: "Traffic Rules Assessment",
    category: "Rules",
    questions: 30,
    difficulty: "Intermediate",
    status: "Draft",
    lastUpdated: "2024-01-14",
  },
  {
    id: "TEST003",
    title: "Emergency Procedures Quiz",
    category: "Emergency",
    questions: 20,
    difficulty: "Advanced",
    status: "Published",
    lastUpdated: "2024-01-13",
  },
]

export function TestsList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileQuestion className="mr-2 h-4 w-4 text-muted-foreground" />
                  {test.title}
                </div>
              </TableCell>
              <TableCell>{test.category}</TableCell>
              <TableCell>{test.questions}</TableCell>
              <TableCell>{test.difficulty}</TableCell>
              <TableCell>
                <Badge
                  variant={test.status === "Published" ? "default" : "secondary"}
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{test.lastUpdated}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
