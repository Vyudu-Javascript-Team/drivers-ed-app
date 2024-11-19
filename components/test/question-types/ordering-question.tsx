'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';

interface OrderingQuestionProps {
  question: {
    text: string;
    options: string[];
    explanation?: string;
  };
  onAnswer: (answer: number[]) => void;
  showFeedback?: boolean;
  correctAnswer?: number[];
  userAnswer?: number[];
}

export function OrderingQuestion({
  question,
  onAnswer,
  showFeedback,
  correctAnswer,
  userAnswer,
}: OrderingQuestionProps) {
  const [items, setItems] = useState(
    question.options.map((text, index) => ({
      id: `${index}`,
      text,
    }))
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination || showFeedback) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    onAnswer(newItems.map(item => parseInt(item.id)));
  };

  const getItemStyle = (index: number) => {
    if (!showFeedback) return '';
    if (correctAnswer?.[index] === parseInt(items[index].id)) {
      return 'border-green-500 bg-green-50 dark:bg-green-900';
    }
    return 'border-red-500 bg-red-50 dark:bg-red-900';
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <p className="text-lg font-medium">{question.text}</p>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                    isDragDisabled={showFeedback}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div
                          className={`flex items-center gap-2 p-4 border rounded-lg ${getItemStyle(
                            index
                          )}`}
                        >
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          {item.text}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {showFeedback && question.explanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </div>
    </Card>
  );
}