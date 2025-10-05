import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/c1bced89-c78d-4835-a715-c7c21a77ab34';

interface User {
  id: number;
  email: string;
  created_at: string;
}

interface AdminPanelProps {
  user: { id: number; email: string };
  onLogout: () => void;
}

export default function AdminPanel({ user, onLogout }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки данных');
      }

      setUsers(data.users);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить пользователей',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Icon name="Database" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-normal text-gray-900">База данных</h1>
              <p className="text-gray-600">Вы вошли как {user.email}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="h-10"
          >
            <Icon name="LogOut" className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-medium">Зарегистрированные пользователи</CardTitle>
                <CardDescription className="mt-1">
                  Всего пользователей: {users.length}
                </CardDescription>
              </div>
              <Button
                onClick={fetchUsers}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <Icon name="RefreshCw" className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Users" className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Пока нет зарегистрированных пользователей</p>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Эл. почта</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                      <TableHead className="text-right">Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">#{u.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon name="Mail" className="h-4 w-4 text-gray-400" />
                            {u.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(u.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={u.id === user.id ? 'default' : 'secondary'}>
                            {u.id === user.id ? 'Вы' : 'Активен'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
