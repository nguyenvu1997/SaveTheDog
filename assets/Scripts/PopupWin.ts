import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupWin')
export class PopupWin extends Component {

    @property (Node)
    button: Node

    onLoad() {
        this.button.on('click', function() {
            console.log('Click Button Next Level')

            const game = this.node.parent.getComponent('GamePlay')

            this.hidePopup()

            game.currentLevel += 1
            game.loadDataLevel()
        }, this);
    }

    public showPopup(): void{
        let tweenDuration: number = 0.2;
        tween(this.node)
        .to(tweenDuration, { scale: new Vec3(1,1,1) }, {
            easing: "linear",
        })
        .start()
    }

    public hidePopup(): void{
        let tweenDuration: number = 0.2;
        tween(this.node)
        .to(tweenDuration, { scale: new Vec3(0,0,0) }, {
            easing: "linear",
        })
        .start()
    }
}


