import { _decorator, Component, Node, Prefab, instantiate, Label, Scheduler } from 'cc';
import { OwlController } from './OwlController';
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
    private time: Node

    private currentLevel: number = 1
    private spawnSchedule: Function
    private countdownSchedule: Function

    private dataLevel = {
        1: {
            dogPosition: {x: -365, y: -127.5},
            hivePosition: {x: 430, y: 270},
            time: 10
        },
        2: {
            dogPosition: {x: -365, y: -127.5},
            hivePosition: {x: 430, y: 270},
            time: 10
        },
        3: {
            dogPosition: {x: -365, y: -127.5},
            hivePosition: {x: 430, y: 270},
            time: 10
        }
    }

    private loadDataLevel(): void{
        //
    }

    public countdownTimer(): void{
        const label = this.time.getComponent(Label)
        let time = this.dataLevel[this.currentLevel].time

        this.schedule(() => {
            time -= 1
            label.string = time.toString()

            if(time == 0) {
                this.unscheduleAllCallbacks()
            }
        }, 1)
    }

    public spawnOwls(): void{
        this.schedule(() => {
            let owl = instantiate(this.owlPrefab)

            owl.parent = this.node.parent

            owl.setPosition(this.hive.getPosition())

            const owlController = owl.getComponent(OwlController)

            owlController.setTargetPosition(this.dog.getPosition(), owl)
        }, 1)
    }
}