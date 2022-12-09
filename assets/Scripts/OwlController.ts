import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OwlController')
export class OwlController extends Component {
    @property (Node)
    private owl: Node

    private speed: number = 0
    private currentPosition = new Vec3()
    private targetPosition = new Vec3()

    start() {
        this.speed = 10
    }

    update(deltaTime: number) {
        //
    }

    public setTargetPosition(dogPosition: Vec3, owl: Node): void{
        let tweenDuration: number = 1.0;
        tween(owl)
        .to(tweenDuration, { position: new Vec3(dogPosition) }, {
            easing: "linear",
        })
        .start();
    }
}


