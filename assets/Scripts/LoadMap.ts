import { _decorator, Component, Node, TiledMap, instantiate, Prefab, RigidBody2D, BoxCollider2D, ERigidBody2DType, Size, Vec3, UITransform, TiledMapAsset, resources, native, AssetManager, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadMap')
export class LoadMap extends Component {
    @property (Node)
    dog: Node
    @property (Node)
    hive: Node
    @property(Prefab)
    obstacle: Prefab

    private tileMap: TiledMap
    private listObstacles: Node[] = []

    onLoad(): void{
        this.tileMap = this.node.getComponent(TiledMap)
    }

    loadLevel(level: string): void{
        assetManager.loadBundle('BundleTiledMap', (err, bundle) => {
            bundle.load(level, TiledMapAsset, (err, tmxAsset) => {
                this.destroyObstacles()
                this.tileMap.tmxAsset = tmxAsset
                this.renderMap()
            });
        })
    }

    renderMap(): void{
        const dog = this.tileMap.getObjectGroup('Dog')
        let object = dog.getObject('')
        const { x : xDog, y: yDog } = object

        const sizeParent = this.node.parent.getComponent(UITransform)
        const {width: widthParent, height: heightParent} = sizeParent

        this.dog.setPosition(new Vec3(xDog - widthParent/2, yDog - heightParent/2, 0))

        const hive = this.tileMap.getObjectGroup('Hive')
        object = hive.getObject('')
        const { x: xHive, y: yHive } = object

        this.hive.setPosition(new Vec3(xHive - widthParent/2, yHive - heightParent/2, 0))

        const obstacles = this.tileMap.getObjectGroup('Obstacles')
        const objects = obstacles.getObjects()

        for (var i = 0; i < objects.length; i++) {
            var { x, y, width, height } = objects[i]
            var node = instantiate(this.obstacle);

            this.listObstacles.push(node)
            
            node.setPosition(x - widthParent/2 + width / 2, y - heightParent/2 + height/2, 0);

            const sprite = node.getChildByName('obstacle')

            const transform = sprite.getComponent(UITransform)
            const rigidBody = node.addComponent(RigidBody2D)
            const collider = node.addComponent(BoxCollider2D);

            rigidBody.gravityScale = 0
            rigidBody.group = 2
            rigidBody.type = ERigidBody2DType.Static

            transform.contentSize = new Size(width, height)
            collider.size = new Size(width, height)
            collider.apply()

            this.node.addChild(node);
        }
    }

    private destroyObstacles(): void{
        this.listObstacles.forEach((obstacle: Node) => {
            obstacle.destroy()
        });
    }
}


