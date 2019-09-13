class Utils {
    static createVector(x,y,z, color = 0xffffff) {
        return {x: x, y: y, z: z, color: color}         
    }

    static createCrossProduct(v1, v2)
    {
        let x = v1.y * v2.z - v1.z * v2.y;
        let y = v1.z * v2.x - v1.x * v2.z;
        let z = v1.x * v2.y - v1.y * v2.x;
        return this.createVector(x, y, z, 0xffff00); 
    }
    
    static add(v1, v2) {
        let x = v1.x + v2.x;
        let y = v1.y + v2.y;
        let z = v1.z + v2.z;
        return this.createVector(x, y, z, 0x00ffff);
    }

    static subtract(v1, v2) {
        let x = v1.x - v2.x;
        let y = v1.y - v2.y;
        let z = v1.z - v2.z;
        return this.createVector(x, y, z, 0xff00ff);
    }

    static calculateVectorLenght(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    static calculateDotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    static normalize(v) {
        return this.createVector(v.x/this.calculateVectorLenght(v),
                                 v.y/this.calculateVectorLenght(v),
                                 v.z/this.calculateVectorLenght(v), 
                                 0xffff00); 
    }

    static calculageAngle(v1, v2) {
        return Math.acos(this.calculateDotProduct(v1, v2) / (this.calculateVectorLenght(v1) * this.calculateVectorLenght(v2)));
    }
}