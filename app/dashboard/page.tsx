'use client';

import { Activity, useMemo, useState } from 'react';
import useTasks from '@/hooks/useTasks';
import TaskCard from '@/components/TaskCard';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Divide, ListTodo, Plus } from 'lucide-react';
import CreateTaskForm from '@/components/CreateTaskForm';
import Tipography from '@/components/Tipography';
import { Input } from '@/components/ui/input';
import { formStyle } from '../tailwindGlobal';

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false);
  const { tasks, isLoading } = useTasks();
  const [search, setSearch] = useState<string>('');
  const hasTasks = tasks.length > 0;

  const filteredTasks = useMemo(() => {
    if (!search) return tasks;

    return tasks.filter((task) => {
      task.title.toLowerCase().includes(search.toLowerCase());
    });
  }, [tasks, search]);

  if (isLoading) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <div className="relative h-full">
      <header
        className="
          sticky top-0 z-10
          bg-background
          border-b
        "
      >
        <div
          className="
            px-4 py-4
            flex items-center gap-4
            max-w-7xl
          "
        >
          <Tipography variant="h2" className="text-lg font-semibold whitespace-nowrap">
            Minhas tarefas
          </Tipography>

          {/* busca menor, não ocupa tudo */}
          <Input
            placeholder="Buscar tarefa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72"
          />

          <Button onClick={() => setShowForm(true)}>
            Nova tarefa
          </Button>
        </div>
      </header>
      <section className="px-4 py-6 max-w-7xl">
        {filteredTasks.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListTodo />
              </EmptyMedia>
              <EmptyTitle>Sem tarefas ainda</EmptyTitle>
              <Divide />
            </EmptyHeader>

            <EmptyContent>
              <Button onClick={() => setShowForm(true)}>
                Criar primeira tarefa
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      <Activity mode={showForm ? 'visible' : 'hidden'}>
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative w-105 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              className="
                absolute -top-4 -right-4
                rounded-full
                bg-red-600 hover:bg-red-700
                text-white
                px-4 py-1 text-sm font-medium shadow-lg z-10 "
            >
              Cancelar
            </Button>
            <CreateTaskForm />
          </div>
        </div>
      </Activity>

    </div>
  );
}
