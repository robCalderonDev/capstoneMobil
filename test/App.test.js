import renderer from 'react-test-renderer'
import ModalIncidence from '../src/components/modals/ModalIncidence';

import React, { useState } from 'react'
describe('<App />', () => {
    it('has 1 child', () => {
        const tree = renderer.create(<ModalIncidence />).toJSON();
        expect(tree.children.length).toBe(1);
    });
    it("renders correctly", () => {
        const tree = renderer.create(<ModalIncidence />).toJSON();
        expect(tree).toMatchSnapshot()
    })
});
