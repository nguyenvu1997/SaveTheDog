import { _decorator, Component, Node, Prefab, instantiate, Label, Scheduler, Vec3, RigidBody, RigidBody2D, Graphics } from 'cc';
import { OwlController } from './OwlController';
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
    private popupWin: Node

    private currentLevel: number = 1
    private spawnSchedule: Function
    private countdownSchedule: Function

    private listOwls = []

    private dataLevel = {
        1: {
            dogPosition: new Vec3(-365, -127.5, 0),
            hivePosition: new Vec3(430, 270, 0),
            time: 3
        },
        2: {
            dogPosition: new Vec3(-365, -127.5, 0),
            hivePosition: new Vec3(430, 270, 0),
            time: 10
        },
        3: {
            dogPosition: new Vec3(-365, -127.5, 0),
            hivePosition: new Vec3(430, 270, 0),
            time: 10
        }
    }

    public loadDataLevel(): void{
        const dogPosition = this.dataLevel[this.currentLevel].dogPosition
        const hivePosition = this.dataLevel[this.currentLevel].hivePosition

        const dogRigidBody = this.dog.getComponent(RigidBody2D)
        const graphic = this.drawing.getComponent(Graphics)

        dogRigidBody.gravityScale = 0

        graphic.clear()

        this.resetListOwl()

        this.dog.setPosition(dogPosition)
        this.hive.setPosition(hivePosition)
    }

    private resetListOwl(): void{
        this.listOwls.forEach(owl => {
            owl.destroy()
        });

        this.listOwls = []
    }

    public countdownTimer(): void{
        const label = this.time.getComponent(Label)
        let time = this.dataLevel[this.currentLevel].time

        this.schedule(() => {
            time -= 1
            label.string = time.toString()

            if(time == 0) {
                this.unscheduleAllCallbacks()

                this.popupWin.getComponent(PopupWin).showPopup()
            }
        }, 1)
    }

    public setDogGravity(): void{
        const dogRigidBody = this.dog.getComponent(RigidBody2D)
        dogRigidBody.gravityScale = 10
        dogRigidBody.wakeUp()
    }

    public spawnOwls(): void{
        this.schedule(() => {
            let owl = instantiate(this.owlPrefab)

            this.listOwls.push(owl)

            owl.parent = this.node.parent

            owl.setPosition(this.hive.getPosition())

            const owlController = owl.getComponent(OwlController)

            owlController.setTargetPosition(this.dog.getPosition(), owl)
        }, 1)
    }
}