import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonController')
export class ButtonController extends Component {
    @property (Node)
    button: Node


    onLoad() {
        this.button.on('click', function() {
            this.button.active = false
            const game = this.node.parent.getComponent('GamePlay')
        }, this);
    }
}


