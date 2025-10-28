import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowDownToLine,
  ArrowUpFromLine,
  Zap,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SkillPoolStats {
  poolBalance: { sol: string; usd: string };
  revenue: {
    total: string;
    failedTests: string;
    ads: string;
    partnerships: string;
    other: string;
  };
  rewards: { total: string; monthly: string };
  users: { active: number; totalTests: number; totalCertificates: number };
  revenuePercentages: { failedTests: number; ads: number; partnerships: number; other: number };
  rewardPercentages: { senior: number; middle: number; junior: number };
}

export default function SkillPool() {
  const { publicKey } = useWallet();

  const { data: stats, isLoading } = useQuery<SkillPoolStats>({
    queryKey: ['/api/skillpool/stats'],
    refetchInterval: 30000,
  });

  const revenueStreams = [
    {
      icon: Users,
      title: "Неудачные попытки тестов",
      description: "Платежи от пользователей, не прошедших тест (score < 70)",
      percentage: `${stats?.revenuePercentages.failedTests || 45}%`,
      amount: `${stats?.revenue.failedTests || '0.00'} SOL`,
      color: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400"
    },
    {
      icon: Zap,
      title: "Реклама",
      description: "Доход от рекламных размещений на платформе",
      percentage: `${stats?.revenuePercentages.ads || 30}%`,
      amount: `${stats?.revenue.ads || '0.00'} SOL`,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    },
    {
      icon: Award,
      title: "Партнерские программы",
      description: "Комиссии от партнерских интеграций",
      percentage: `${stats?.revenuePercentages.partnerships || 15}%`,
      amount: `${stats?.revenue.partnerships || '0.00'} SOL`,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Прочее",
      description: "Дополнительные источники дохода",
      percentage: `${stats?.revenuePercentages.other || 10}%`,
      amount: `${stats?.revenue.other || '0.00'} SOL`,
      color: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400"
    }
  ];

  const rewardDistribution = [
    {
      level: "Senior",
      percentage: `${stats?.rewardPercentages.senior || 15}%`,
      description: "90-100 баллов",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500"
    },
    {
      level: "Middle",
      percentage: `${stats?.rewardPercentages.middle || 12}%`,
      description: "80-89 баллов",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      level: "Junior",
      percentage: `${stats?.rewardPercentages.junior || 10}%`,
      description: "70-79 баллов",
      color: "bg-gradient-to-r from-green-500 to-emerald-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzgwODBmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <Coins className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Реальные данные из базы</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif">
              SkillPool
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Общий пул средств платформы, формируемый из различных источников дохода и используемый для вознаграждения успешных участников
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-card-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Баланс пула</span>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">{stats?.poolBalance.sol} SOL</p>
                <p className="text-sm text-muted-foreground">${stats?.poolBalance.usd}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Общий доход</span>
                <ArrowDownToLine className="h-4 w-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono text-green-500">{stats?.revenue.total} SOL</p>
                <p className="text-sm text-muted-foreground">Всего платформы</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Всего выплачено</span>
                <ArrowUpFromLine className="h-4 w-4 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono text-blue-500">{stats?.rewards.total} SOL</p>
                <p className="text-sm text-muted-foreground">{stats?.users.totalCertificates} сертификатов</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Активных пользователей</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono">{stats?.users.active}</p>
                <p className="text-sm text-muted-foreground">{stats?.users.totalTests} тестов пройдено</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ArrowDownToLine className="h-6 w-6 text-green-500" />
            <div>
              <h2 className="text-2xl font-bold font-serif">Источники дохода</h2>
              <p className="text-muted-foreground">Откуда пополняется SkillPool</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revenueStreams.map((stream) => (
              <Card key={stream.title} className="p-6 border-card-border hover-elevate transition-all">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br border ${stream.color} flex-shrink-0`}>
                    <stream.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold">{stream.title}</h3>
                      <Badge variant="secondary" className="flex-shrink-0">{stream.percentage}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>
                    <p className="text-lg font-bold font-mono">{stream.amount}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ArrowUpFromLine className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold font-serif">Распределение вознаграждений</h2>
              <p className="text-muted-foreground">Процент от стоимости теста возвращается успешным участникам</p>
            </div>
          </div>

          <Card className="p-8 border-card-border">
            <div className="space-y-6">
              {rewardDistribution.map((reward, index) => (
                <div key={reward.level} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{reward.level} уровень</h4>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <Badge className={`${reward.color} text-white border-0`}>
                      {reward.percentage} возврат
                    </Badge>
                  </div>
                  {index < rewardDistribution.length - 1 && (
                    <div className="border-b border-border" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Пример расчета</p>
                <p className="text-sm text-muted-foreground">
                  При стоимости теста 0.15 SOL и результате Senior (15% возврат), участник получает обратно 0.0225 SOL.
                  Оставшиеся 0.1275 SOL остаются в SkillPool для поддержки платформы и будущих вознаграждений.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif">Как работает SkillPool</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-card-border">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <span className="text-lg font-bold text-green-400">1</span>
                </div>
                <h3 className="font-semibold">Пополнение</h3>
                <p className="text-sm text-muted-foreground">
                  Средства поступают из платежей за тесты, рекламы и партнерских программ
                </p>
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <span className="text-lg font-bold text-blue-400">2</span>
                </div>
                <h3 className="font-semibold">Накопление</h3>
                <p className="text-sm text-muted-foreground">
                  Пул аккумулирует средства для обеспечения стабильных выплат вознаграждений
                </p>
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <span className="text-lg font-bold text-purple-400">3</span>
                </div>
                <h3 className="font-semibold">Распределение</h3>
                <p className="text-sm text-muted-foreground">
                  Успешные участники получают вознаграждения в зависимости от уровня сертификата
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
