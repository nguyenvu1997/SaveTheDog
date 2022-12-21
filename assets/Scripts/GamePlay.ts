import { _decorator, Component, Node, Prefab, instantiate, Label, Scheduler, Vec3, RigidBody, RigidBody2D, Graphics, SpriteRenderer, BoxCollider2D, Vec2, PolygonCollider2D, UITransform, ERigidBody2DType, director } from 'cc';
import { DrawingController } from './DrawingController';
import { LoadMap } from './LoadMap';
import { OwlController } from './OwlController';
import { PopupLose } from './PopupLose';
import { PopupWin } from './PopupWin';
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
    @property (Node)
    private time: Node
    @property (Node)
    private tiledMap: Node
    @property (Node)
    private popupWin: Node
    @property (Node)
    private popupLose: Node

    private currentLevel: number = 1

    private listOwls = []

    public isGameRunning: boolean

    public onLoad(): void{
        this.isGameRunning = true
        this.dog.active = false
        this.hive.active = false
    }

    public loadDataLevel(): void{
        const loadMap = this.tiledMap.getComponent(LoadMap)
        const dogRigidBody = this.dog.getComponent(RigidBody2D)
        const graphic = this.drawing.getComponent(Graphics)
        let rigidBody = this.drawing.getComponent(RigidBody2D)

        this.isGameRunning = false

        this.dog.angle = 0
        this.dog.setRotation(0, 0, 0, 0)
        dogRigidBody.type = ERigidBody2DType.Static
        dogRigidBody.type = ERigidBody2DType.Dynamic
        dogRigidBody.gravityScale = 0

        this.drawing.setPosition(new Vec3(0,0,0))
        this.drawing.setRotation(0, 0, 0, 0)

        rigidBody.type = ERigidBody2DType.Static

        graphic.clear()

        loadMap.loadLevel(this.currentLevel.toString())
        loadMap.renderMap()

        this.resetListOwl()
    }

    public startGame(): void{
        this.isGameRunning = false
        this.dog.active = true
        this.hive.active = true
    }

    private resetListOwl(): void{
        this.listOwls.forEach(owl => {
            owl.destroy()
        })

        this.listOwls = []
    }

    public countdownTimer(): void{
        this.isGameRunning = true

        const label = this.time.getComponent(Label)
        let time = 2

        this.schedule(() => {
            time -= 1
            label.string = time.toString()

            if(time == 0) {
                this.unscheduleAllCallbacks()

                this.popupWin.getComponent(PopupWin).showPopup()
            }
        }, 1)
    }

    public showPopupLose(): void{
        this.unscheduleAllCallbacks()

        this.popupLose.getComponent(PopupLose).showPopup()
    }

    public setDogGravity(): void{
        const dogRigidBody = this.dog.getComponent(RigidBody2D)
        dogRigidBody.gravityScale = 1
        dogRigidBody.wakeUp()
    }

    public spawnOwls(): void{
        this.schedule(() => {
            let owl = instantiate(this.owlPrefab)

            this.listOwls.push(owl)

            owl.parent = this.node

            owl.setPosition(this.hive.getPosition())

            const owlController = owl.getComponent(OwlController)

            owlController.setTargetPosition(this.dog)
        }, 1)
    }
}