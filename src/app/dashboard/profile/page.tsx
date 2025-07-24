import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">User Profile</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="analyst@betvaluator.edge" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankroll">Current Bankroll (€)</Label>
            <Input id="bankroll" defaultValue="10483.21" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staking">Default Staking Plan</Label>
            <Select defaultValue="QuarterKelly">
              <SelectTrigger id="staking">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QuarterKelly">Quarter Kelly</SelectItem>
                <SelectItem value="HalfKelly">Half Kelly</SelectItem>
                <SelectItem value="FullKelly">Full Kelly</SelectItem>
                <SelectItem value="Percentage">Percentage (1%)</SelectItem>
                <SelectItem value="Fixed">Fixed (€10)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
