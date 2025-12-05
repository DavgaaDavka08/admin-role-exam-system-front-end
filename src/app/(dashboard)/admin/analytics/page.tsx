"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { TrendingUp, Users, Award, Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { AdminSidebar } from "@/app/components/admin-sidebar"

const scoreDistribution = [
  { range: "0-20%", count: 5 },
  { range: "21-40%", count: 12 },
  { range: "41-60%", count: 28 },
  { range: "61-80%", count: 45 },
  { range: "81-100%", count: 35 },
]

const timeDistribution = [
  { time: "0-15 мин", count: 8 },
  { time: "16-30 мин", count: 35 },
  { time: "31-45 мин", count: 52 },
  { time: "46-60 мин", count: 28 },
  { time: "60+ мин", count: 2 },
]

const mostFailedQuestions = [
  { question: "Асуулт 7: Интегралын үндсэн томъёо", failRate: 78, attempts: 45 },
  { question: "Асуулт 15: Хуримтлалын функц", failRate: 65, attempts: 45 },
  { question: "Асуулт 3: Дифференциал томъёо", failRate: 58, attempts: 45 },
  { question: "Асуулт 12: Геометрийн прогресс", failRate: 52, attempts: 45 },
  { question: "Асуулт 18: Вектор бодлого", failRate: 48, attempts: 45 },
]

const performanceTrend = [
  { exam: "Шалгалт 1", avgScore: 72 },
  { exam: "Шалгалт 2", avgScore: 68 },
  { exam: "Шалгалт 3", avgScore: 75 },
  { exam: "Шалгалт 4", avgScore: 82 },
  { exam: "Шалгалт 5", avgScore: 78 },
]

const passFailData = [
  { name: "Тэнцсэн", value: 105, color: "hsl(var(--chart-2))" },
  { name: "Унасан", value: 20, color: "hsl(var(--destructive))" },
]

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold">Статистик & Анализ</h1>
              <p className="text-sm text-muted-foreground">Үр дүнгийн дэлгэрэнгүй мэдээлэл</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +5%
                  </Badge>
                </div>
                <div className="text-3xl font-bold">78%</div>
                <p className="text-sm text-muted-foreground">Дундаж оноо</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="rounded-lg bg-accent/10 p-3 text-accent">
                    <Award className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    TOP
                  </Badge>
                </div>
                <div className="text-3xl font-bold">98%</div>
                <p className="text-sm text-muted-foreground">Хамгийн өндөр оноо</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <Badge className="text-xs">84%</Badge>
                </div>
                <div className="text-3xl font-bold">105</div>
                <p className="text-sm text-muted-foreground">90+ авсан сурагч</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="rounded-lg bg-muted p-3">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold">38</div>
                <p className="text-sm text-muted-foreground">Дундаж хугацаа (мин)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Онооны тархалт</CardTitle>
                <CardDescription>Сурагчдын онооны ангилал</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Сурагчийн тоо",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="range" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pass/Fail Ratio */}
            <Card>
              <CardHeader>
                <CardTitle>Тэнцэх/Унах харьцаа</CardTitle>
                <CardDescription>Нийт 125 сурагч</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Тоо",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={passFailData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {passFailData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Хугацааны тархалт</CardTitle>
                <CardDescription>Сурагчид ямар хугацаанд шалгалт өгсөн</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Сурагчийн тоо",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Үзүүлэлтийн чиг хандлага</CardTitle>
                <CardDescription>Дундаж онооны өөрчлөлт</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    avgScore: {
                      label: "Дундаж оноо",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="exam" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgScore"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--chart-3))", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Most Failed Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Хамгийн их буруулагдсан асуултууд</CardTitle>
              </div>
              <CardDescription>Сурагчид эдгээр асуултад хамгийн их буруу хариулсан</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mostFailedQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">{item.attempts} оролдлого</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-destructive">{item.failRate}%</div>
                        <p className="text-xs text-muted-foreground">Буруу хувь</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
