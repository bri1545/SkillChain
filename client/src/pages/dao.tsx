import { useWallet } from '@solana/wallet-adapter-react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Users, 
  Award, 
  Coins,
  CheckCircle2,
  Wallet,
  Loader2,
  Database,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DAOStats {
  totalValidators: number;
  totalCertificates: number;
  totalUsers: number;
  rewardDistribution: { senior: number; middle: number; junior: number };
  revenueStreams: { failedTests: number; ads: number; partnerships: number; other: number };
}

interface OnChainProfile {
  exists: boolean;
  pda: string;
  profile: {
    walletAddress: string;
    totalTests: number;
    passedTests: number;
    totalEarned: number;
    skills: Array<{
      skillId: string;
      level: string;
      score: number;
      earnedAt: string;
      nftMint: string;
    }>;
  } | null;
  message: string;
}

interface SkillRegistry {
  pda: string;
  registry: {
    totalUsers: number;
    totalCertificates: number;
    totalValidators: number;
  } | null;
  programId: string;
}

export default function DAO() {
  const { publicKey } = useWallet();

  const { data: daoStats, isLoading: statsLoading } = useQuery<DAOStats>({
    queryKey: ['/api/dao/stats'],
    refetchInterval: 30000,
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery<OnChainProfile>({
    queryKey: ['/api/onchain/profile', publicKey?.toString()],
    enabled: !!publicKey,
    refetchInterval: 30000,
  });

  const { data: registry, isLoading: registryLoading } = useQuery<SkillRegistry>({
    queryKey: ['/api/onchain/registry'],
    refetchInterval: 30000,
  });

  const isLoading = statsLoading || registryLoading;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzhkNDhmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Shield className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-500">Децентрализованное управление</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif">
              SkillChain DAO
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Децентрализованная автономная организация для управления платформой сертификации навыков на блокчейне Solana
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {publicKey && (
            <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-purple-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Ваш on-chain профиль</h3>
                    <p className="text-sm text-muted-foreground">
                      {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                    </p>
                  </div>
                </div>

                {profileLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Загрузка профиля...</span>
                  </div>
                ) : userProfile?.exists ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-green-500">Профиль активен</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Всего тестов</p>
                        <p className="text-2xl font-bold">{userProfile.profile ? userProfile.profile.totalTests : 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Пройдено</p>
                        <p className="text-2xl font-bold text-green-500">{userProfile.profile ? userProfile.profile.passedTests : 0}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Заработано</p>
                        <p className="text-2xl font-bold text-purple-500">{userProfile.profile ? userProfile.profile.totalEarned.toFixed(3) : '0.000'} SOL</p>
                      </div>
                    </div>
                    {userProfile.profile?.skills && userProfile.profile.skills.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm font-medium mb-2">Верифицированные навыки:</p>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.profile.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              <Award className="h-3 w-3" />
                              {skill.skillId} ({skill.level})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground font-mono">
                        PDA: {userProfile.pda.slice(0, 20)}...{userProfile.pda.slice(-20)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <Database className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">
                        Профиль не создан
                      </p>
                      <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80">
                        {userProfile?.message || 'Пройдите первый тест чтобы создать on-chain профиль'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-card-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Shield className="h-8 w-8 text-purple-500" />
                  <Badge variant="secondary">{daoStats?.totalValidators || 0}</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Валидаторы DAO</h3>
                  <p className="text-sm text-muted-foreground">
                    Верифицируют результаты тестов
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Award className="h-8 w-8 text-blue-500" />
                  <Badge variant="secondary">{registry?.registry?.totalCertificates || daoStats?.totalCertificates || 0}</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Сертификатов выдано</h3>
                  <p className="text-sm text-muted-foreground">
                    NFT сертификаты на блокчейне
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-green-500" />
                  <Badge variant="secondary">{registry?.registry?.totalUsers || daoStats?.totalUsers || 0}</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Участников</h3>
                  <p className="text-sm text-muted-foreground">
                    Зарегистрированных пользователей
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <PieChart className="h-6 w-6 text-purple-500" />
              <div>
                <h2 className="text-2xl font-bold font-serif">Распределение вознаграждений</h2>
                <p className="text-muted-foreground">Процент от стоимости теста (0.15 SOL) возвращается успешным участникам</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-card-border hover-elevate transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Award className="h-6 w-6 text-yellow-500" />
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      {daoStats?.rewardDistribution.senior || 15}%
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Senior уровень</h3>
                    <p className="text-sm text-muted-foreground mb-2">90-100 баллов</p>
                    <p className="text-2xl font-bold font-mono">0.0225 SOL</p>
                    <p className="text-xs text-muted-foreground mt-1">возврат за Senior</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-card-border hover-elevate transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Award className="h-6 w-6 text-blue-500" />
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                      {daoStats?.rewardDistribution.middle || 12}%
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Middle уровень</h3>
                    <p className="text-sm text-muted-foreground mb-2">80-89 баллов</p>
                    <p className="text-2xl font-bold font-mono">0.018 SOL</p>
                    <p className="text-xs text-muted-foreground mt-1">возврат за Middle</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-card-border hover-elevate transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Award className="h-6 w-6 text-green-500" />
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                      {daoStats?.rewardDistribution.junior || 10}%
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Junior уровень</h3>
                    <p className="text-sm text-muted-foreground mb-2">70-79 баллов</p>
                    <p className="text-2xl font-bold font-mono">0.015 SOL</p>
                    <p className="text-xs text-muted-foreground mt-1">возврат за Junior</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <div>
                <h2 className="text-2xl font-bold font-serif">Источники дохода DAO</h2>
                <p className="text-muted-foreground">Распределение поступлений в платформу</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Неудачные тесты', percent: daoStats?.revenueStreams.failedTests || 45, color: 'from-red-500/20 to-orange-500/20 border-red-500/30' },
                { title: 'Реклама', percent: daoStats?.revenueStreams.ads || 30, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
                { title: 'Партнерства', percent: daoStats?.revenueStreams.partnerships || 15, color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
                { title: 'Прочее', percent: daoStats?.revenueStreams.other || 10, color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
              ].map((source) => (
                <Card key={source.title} className={`p-4 bg-gradient-to-br border ${source.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{source.title}</span>
                    <Badge variant="secondary">{source.percent}%</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {registry && (
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Информация о Smart Contract</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[120px]">Program ID:</span>
                    <code className="font-mono text-xs break-all">{registry.programId}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[120px]">Registry PDA:</span>
                    <code className="font-mono text-xs break-all">{registry.pda}</code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground min-w-[120px]">Статус:</span>
                    <Badge variant="secondary" className="h-5">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Работает на PostgreSQL
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Все данные хранятся в PostgreSQL базе данных. Anchor smart contract готов к развертыванию на Solana Devnet.
                </p>
              </div>
            </Card>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif">Как работает DAO</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  number: '1',
                  title: 'Верификация',
                  description: 'Валидаторы DAO проверяют и подтверждают результаты тестов',
                  color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
                },
                {
                  number: '2',
                  title: 'Минтинг NFT',
                  description: 'После верификации выдается NFT сертификат на блокчейне Solana',
                  color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400'
                },
                {
                  number: '3',
                  title: 'Распределение',
                  description: 'Smart contract автоматически распределяет награды участникам',
                  color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400'
                }
              ].map((step) => (
                <Card key={step.number} className="p-6 border-card-border">
                  <div className="space-y-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br border ${step.color}`}>
                      <span className="text-lg font-bold">{step.number}</span>
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
