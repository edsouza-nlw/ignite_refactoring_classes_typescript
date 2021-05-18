import { useRef, useCallback } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Modal } from '../Modal';
import { Input } from '../Input';
import { FormHandles } from '@unform/core';

import { Form } from './styles';

interface FoodDish {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  available: boolean;
}

interface ModalEditFoodProps {
  isOpen: boolean;
  setIsOpen: () => void;
  editingFood: FoodDish;
  handleUpdateFood: (food: FoodDish) => void;
}

export function ModalEditFood({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}: ModalEditFoodProps) {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data) => {
      // async function handleSubmit(data: FoodDish) {
      handleUpdateFood(data);
      setIsOpen();
    },
    [handleUpdateFood, setIsOpen]
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}
