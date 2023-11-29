import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ModalReset from '../src/components/ModalReset';

describe('ModalReset Integration Test', () => {
    it('should open, close modal, and show your email on pressing "Vale" button', async () => {
        const mockSetModalVisible = jest.fn();
        const mockSetEmail = jest.fn();

        const { getByTestId, queryByTestId } = render(
            <ModalReset
                modalVisible={true}
                setModalVisible={mockSetModalVisible}
                email="test@example.com"
                setEmail={mockSetEmail}
            />
        );

        // Asegúrate de que el modal esté abierto inicialmente
        expect(getByTestId('modal-container')).toBeTruthy();

        // Presiona el botón "Vale"
        const valeButton = getByTestId('myButton:button:ClickMe');
        fireEvent.press(valeButton);

        // Espera a que las funciones de control se llamen y el modal esté cerrado
        await waitFor(() => {
            expect(mockSetModalVisible).toHaveBeenCalledWith(false);
            expect(mockSetEmail).toHaveBeenCalledWith('');
        });

    });
});
