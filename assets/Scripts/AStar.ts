import { _decorator, Component, Vec3 } from 'cc';
const { ccclass } = _decorator;

@ccclass('AStar')
export class AStar extends Component {
    public manhattan(position1: Vec3, position2: Vec3): number{
        const d1 = Math.abs(position1.x - position2.x)
        const d2 = Math.abs(position1.y - position2.y)

        return d1 + d2
    }
}


