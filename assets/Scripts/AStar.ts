import { _decorator, Component, Vec3, PhysicsSystem2D, Vec2, ERaycast2DType, RaycastResult2D, Node, Collider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AStar')
export class AStar extends Component {
    private ex1: Node
    private ex2: Node

    private left: number
    private right: number
    private top: number
    private bottom: number

    public manhattan(position1: Vec3, position2: Vec3): number{
        const d1 = Math.abs(position1.x - position2.x)
        const d2 = Math.abs(position1.y - position2.y)

        return d1 + d2
    }

    public checkDirectionCanMove(position: Vec3, ex1: Node, ex2: Node): void{
        const worldPosition = new Vec2(position.x, position.y)

        const point = new Vec2(worldPosition.x, worldPosition.y)
        const leftPoint = new Vec2(worldPosition.x - 50, worldPosition.y)
        const rightPoint = new Vec2(worldPosition.x + 50, worldPosition.y)
        const topPoint = new Vec2(worldPosition.x, worldPosition.y + 50)
        const bottomPoint = new Vec2(worldPosition.x, worldPosition.y - 50)

        const checkLeft = this.checkRay(leftPoint, point)
        const checkRight = this.checkRay(rightPoint, point)
        const checkTop = this.checkRay(topPoint, point)
        const checkBot = this.checkRay(bottomPoint, point)

        if(checkLeft){
            console.log('Left', leftPoint, point)
        }

        if(checkRight){
            console.log('Right', rightPoint, point)
        }

        if(checkTop){
            console.log('Top', topPoint, point)
        }

        if(checkBot){
            console.log('Bot', bottomPoint, point)
        }

        ex1.setPosition(new Vec3(worldPosition.x - 960 / 2, worldPosition.y - 640 / 2, 0))
        ex2.setPosition(new Vec3(worldPosition.x - 960 / 2, worldPosition.y - 50 - 640 / 2, 0))
    }

    public checkRay(point: Vec2, nextPoint: Vec2): boolean{
        const raycast = PhysicsSystem2D.instance.raycast(point, nextPoint, ERaycast2DType.Closest) as RaycastResult2D[]

        // if(raycast.length != 0) console.log('raycast', raycast)

        for (let index = 0; index < raycast.length; index++) {
            const raycastResult2D = raycast[index]
            if(raycastResult2D.collider.node.name != 'Drawing') return true
        }

        return false
    }

    public checkPoint(point: Vec2){
        const result = PhysicsSystem2D.instance.testPoint(point) as Collider2D[]

        // console.log('checkPoint', result)

        return result.length == 0 ? false : true
    }
}