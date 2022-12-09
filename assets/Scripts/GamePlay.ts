import { _decorator, Component, Node, Prefab, NodeEventType, instantiate, Graphics, Input, input, KeyCode } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GamePlay')
export class GamePlay extends Component {
    @property (Prefab)
    private owlPrefab: Prefab
    @property (Node)
    private dog: Node
    @property (Node)
    private hive: Node
    @property (Node)
    private drawing: Node

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)

        this.node.on(NodeEventType.TOUCH_START, function(event) {
            console.log('A')
            this.lastPos = event.getLocation();
        }, this)
        
        this.node.on(NodeEventType.TOUCH_MOVE, function(event) {
            console.log('B')

            var g = this.drawing.getComponent(Graphics);

            g.moveTo(this.lastPos.x, this.lastPos.y);
            g.lineTo(event.getLocation().x, event.getLocation().y);
            g.stroke();

            this.lastPos = event.getLocation();
        }, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onKeyDown(event): void{
        const keyCode = event.keyCode

        if(keyCode !== KeyCode.SPACE) return

        let owl = instantiate(this.owlPrefab)

        owl.parent = this.node.parent

        owl.setPosition(this.hive.getPosition())

        const setTargetPosition = owl.getComponent('OwlController')['setTargetPosition']

        setTargetPosition(this.dog.getPosition(), owl)
    }
}