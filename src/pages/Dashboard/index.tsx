import { useEffect, useState, useCallback } from 'react';

import api from '../../services/api';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface FoodDish {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  available: boolean;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodDish[]>([]);

  const [editingFood, setEditingFood] = useState({} as FoodDish);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const { data } = await api.get('/foods');
      setFoods(data);
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(
    async (food) => {
      try {
        const response = await api.post('/foods', {
          ...food,
          available: true,
        });

        setFoods([...foods, response.data]);
      } catch (err) {
        console.log(err);
      }
    },
    [foods]
  );

  const handleUpdateFood = useCallback(
    async (food) => {
      // async function handleUpdateFood(food: FoodDish) {
      try {
        const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
          ...editingFood,
          ...food,
        });

        const foodsUpdated = foods.map((f) =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data
        );

        setFoods(foodsUpdated);
      } catch (err) {
        console.log(err);
      }
    },
    [editingFood, foods, setFoods]
  );

  const handleDeleteFood = useCallback(
    async (id) => {
      // async function handleDeleteFood(id: number) {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter((food) => food.id !== id);

      setFoods(foodsFiltered);
    },
    [foods, setFoods]
  );

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEditFood = useCallback((food) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
