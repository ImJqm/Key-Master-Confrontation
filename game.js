/*
CONTROLS:

-Movement: WASD/Arrow Keys
-Dash: q,shift, or space
*Please note that in order to dash, you must first hold down a dash key, then provide a directional input*


*/





/*
to be added:
- only things needed:
- assets for atk1 & atk2

-indicator for dash cooldown   *completed*
-coordinate system for each square in the grid    *completed*
-the puzzles, lock and key type beat *completed*
-more attacks *completed*
*/
//https://codehs.com/uploads/db030bf87d6437690ad9ca5174bd8cca
//obj
//class for rectangle objects
class obj extends Rectangle {
    constructor(width,height,x,y,color,layer,id) {
        super(width,height);
        this.id = id
        this.setColor(color)
        this.layer = layer
        this.x = x
        this.y = y
    }
}
//initiallizes class for webimage objects
class webobj extends WebImage {
    constructor(filename,width,height,x,y,layer,id) {
        super(filename)
        this.setSize(width,height)
        this.x =x
        this.y =y
        this.layer = layer
        this.id = id
    }
}

//player
/*
class plyer extends obj {
    constructor(width,height,x,y,color,layer,id,lives,iframe,haskey,gridx,gridy) {
        super(width,height,x,y,color,layer,id) 
        this.lives = lives
        this.iframe = iframe
        this.haskey = haskey
        this.gridx = gridx
        this.gridy = gridy
    }
}
*/
//initializes player class
class plyer extends webobj {
    constructor(filename,width,height,x,y,layer,id,lives,iframe,haskey,gridx,gridy) {
        super(filename,width,height,x,y,layer,id)
        this.lives = lives
        this.iframe = iframe
        this.haskey = haskey
        this.gridx = gridx
        this.gridy = gridy
        
    }
}
//sets size of canvas and sets up background
setSize(640,480)
let bg = new webobj("https://codehs.com/uploads/32962b02d3af98ab587b446c1ed8a7d7",getWidth(),getHeight(),0,0,0,"bg")
add(bg)

//sets up various varibales used trhoughout the code

let grd
let bs
let tmpw = false
let tmpa = false
let tmps = false
let tmpd = false
let hand1_atk
let hand2_atk
let Sin = 0
let sinhandx = 0
let sinhandx1 = 0
let sinhandy = 0
let sinhandy1 = 0

//sets up boss and its hands

//bs = new obj(30,30,1000,1000,"blue",1)
bs = new webobj("https://codehs.com/uploads/4c63ebf0443cc84aab1661b481f8bd31",325/3,259/3,1000,1000,1,"boss")
bs.health = 100
bs.phase = 1
add(bs)
let hand1 = new webobj("https://codehs.com/uploads/7d88e45108b32bb30bcfe47dae3fe783",75,75,1000,1000,1,"hand1")
add(hand1)
let hand2 = new webobj("https://codehs.com/uploads/f0158d4ab7576c0e7ca0e94a8f26c10f",75,75,1000,1000,1,"hand2")
add(hand2)

//main
function main() {
    //sets up grid in which the player is in
    grid();
    //sets timer for player's hp updated
    setTimer(hpup, 1)
    //player hit detection
    setTimer(hit, 1)
    //boss hp update
    setTimer(bshpup,1)
    //setTimer(bshpup,1)
    //console.log(plafmX)
    //console.log(plafmY)
    //spawns first key and keyhole
    keyf()
    khol()
    //boss's movement animation
    setTimer(MoveBs,0);
    //pick's bosses attacks
    setTimer(attackPicker,0)
    //checks for key and keyhole for player
    setTimer(keychecker,1)
    //movement
    keyDownMethod(playermove)
    keyUpMethod(kup)
}
//qeues each attack, takes an input and does an attack based on the input
function attackHandler(attack) {
    if (attack == 1) {
        attacking+=1  
        atk1atking = true
        setTimeout(atk1,3000)
    }
    if (attack == 2) {
        attacking+=1
        atk2atking = true
        setTimeout(atk2,3000)
    }
    if (attack == 3) {
        attacking+=1
        atk3atking = true
        setTimeout(bombatk,100)
    }
    if (attack == 4) {
        attacking+=1
        atk4atking = true
        setTimeout(atk4,3000)
    }
    
}
//variables for atacks
let crntatk
let atk1atking = false
let atk2atking = false
let atk3atking = false
let atk4atking = false
let attacking = 0
//picks attacj based off of bosses' phase
function attackPicker() {
    if (attacking < 2) {
        crntatk = Randomizer.nextInt(1,bs.phase)
        if (crntatk == 1 && atk1atking == false){
            attackHandler(crntatk)
        } else if (crntatk == 2 && atk2atking == false){
            attackHandler(crntatk)
        } else if (crntatk == 3 && atk3atking == false){
            attackHandler(crntatk)
        } else if (crntatk == 4 && atk4atking == false){
            attackHandler(crntatk)
        }else{
            attacking-=1
        }
    }
}
//moves boss and its hands, trigonometric functions are used to make it look smooth
function MoveBs(){
    Sin+=.008*Math.PI
    if (Math.sin(Sin) == 0) {
        Sin = 0
    }
    bs.setPosition(getWidth()/2-(0.5*bs.getWidth()),Math.sin(Sin)*22+55);
    
    sinhandx+=.05
    sinhandy+=.06
    hand1.setPosition(Math.sin(sinhandx)*15+(getWidth()/2+130-15-12.5),Math.cos(sinhandy)*10+90);
    hand1.setRotation(Math.sin(sinhandx)*15+90);           

    
    sinhandx1+=.06
    sinhandy1+=.05    
    hand2.setPosition(Math.sin(sinhandx1)*-15+(getWidth()/2-130+15-12.5)-75/2,Math.cos(sinhandy1)*10+90);
    hand2.setRotation(Math.sin(sinhandx1)*-15+90);           
}
//movement
let up = false
let down = false
let left = false
let right = false
let trytodash = false
let temp
let cldn = false
let count;
let offset;
let dashing = false
//main player movement function
function playermove(e) {
    //checks if player is trying to dash
    if ((e.key == "q" || e.key == "Shift" || e.key == "Q" || e.key == " ") && trytodash == false) {
        trytodash = true
    }
    //checks for main movement code
    if (cldn == false) {
        if ((tmpw == true || e.key == "w" || e.key == "ArrowUp") && trytodash == false) {
            if (player.getY() != 174.5) {
                cldn = true
                temp = player.getY();
                player.setImage("https://codehs.com/uploads/52ff75aee6aca0845e8c554b141409fa")
                count = 0
                offset = 1
                //console.log(temp)
                setTimer(smoothup,1)
            }
        }
        if ((tmps == true || e.key == "s" || e.key == "ArrowDown") && trytodash == false ){
            if (player.getY() != 398.5) {
                cldn = true
                temp = player.getY();
                count = 0
                offset = 1
                player.setImage("https://codehs.com/uploads/0fcf8379952cde24cbf0cd39b539a583")
                setTimer(smoothdown,1)
            }
        }
        if ((tmpa == true || e.key == "a" || e.key == "ArrowLeft") && trytodash == false) {
            if (player.getX() != 67.5) {
                cldn = true
                temp = player.getX();
                count = 0
                offset = 1
                player.setImage("https://codehs.com/uploads/006b1af23944ccee5ad00e602c17981c")
                setTimer(smoothleft,1)
            }
        }
        if ((tmpd == true || e.key == "d" || e.key == "ArrowRight") && trytodash == false) {
            if (player.getX() != 547.5) {
                cldn = true
                temp = player.getX()
                count = 0
                offset = 1
                player.setImage("https://codehs.com/uploads/49dcbd8f558874b7c026ef5283f81d11")
                setTimer(smoothright,1) 
            }
        }
        //dash code
        if ((e.key == "w"|| e.key == "ArrowUp") && trytodash == true && dashing == false) {
            dashing = true
            player.setImage("https://codehs.com/uploads/f04bd6fa2d2d75e654ac2e68eb317601")
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/59e077b1b934f50bebfdb06e1afc3fe0")
                heart.setSize(50,50)
            }
            dashhandler("up")
        }
        if ((e.key == "s" || e.key == "ArrowDown") && trytodash == true && dashing == false) {
            dashing = true
            player.setImage("https://codehs.com/uploads/fc6fe8b397b117a2de86444028478be2")
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/59e077b1b934f50bebfdb06e1afc3fe0")
                heart.setSize(50,50)
            }
            dashhandler("down")
        }
        if ((e.key == "a" || e.key == "ArrowLeft") && trytodash == true && dashing == false) {
            dashing = true
            player.setImage("https://codehs.com/uploads/9613ce8fd3616fec5588a7d72388c0ef")
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/59e077b1b934f50bebfdb06e1afc3fe0")
                heart.setSize(50,50)
            }
            dashhandler("left")
        }
        if ((e.key == "d" || e.key == "ArrowRight") && trytodash == true && dashing == false) {
            dashing = true
            player.setImage("https://codehs.com/uploads/e12f359130c6dd71b37476bf92cb9585")
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/59e077b1b934f50bebfdb06e1afc3fe0")
                heart.setSize(50,50)
            }
            dashhandler("right")
        }
    }
}
//dashing
//toggles trying to dash
function kup(e) {
    if ((e.key == "Shift" || e.key == "q" || e.key == "Q" || e.key == " ")&& trytodash == true) {
        trytodash = false
    }
}
//dashes player based on provided direction
function dashhandler(d) {
    if (d == "up" && player.getY() != 174.5 ) {
        temp = player.getY();
        offset = 1
        if (temp == 206.5) {
            player.iframe = true
            setTimer(up1,1)
            coldn = 0
            setTimer(rolecldn,1)
        } else {
            player.iframe = true

            setTimer(up2,1)
            coldn = 0
            setTimer(rolecldn,1)
        }
    } else if (d == "down" && player.getY()!=398.5) {
        temp = player.getY();
        offset = 1
        if (temp == 366.5) {
            player.iframe = true
            
            setTimer(down1,1)
            coldn = 0
            setTimer(rolecldn,1)
        } else {
            player.iframe = true
            
            setTimer(down2,1)
            coldn = 0
            setTimer(rolecldn,1)
        }
    } else if (d == "left" && player.getX()!=67.5) {
        temp = player.getX();    
        offset = 1
        if (temp == 99.5) {
            player.iframe = true
            
            setTimer(left1,1)
            coldn = 0
            setTimer(rolecldn,1)
        } else {
            player.iframe = true
            
            setTimer(left2,1)
            coldn = 0
            setTimer(rolecldn,1)
        }
    } else if (d == "right" && player.getX()!=547.5) {
        temp = player.getX();
        offset = 1
        if (temp == 515.5) {
            player.iframe = true
            
            setTimer(right1,1)
            coldn = 0
            setTimer(rolecldn,1)
        } else {
            player.iframe = true
            
            setTimer(right2,1)
            coldn = 0
            setTimer(rolecldn,1)
        }
    } else {
        dashing = false
    }
}
//any functions labled a direction with a number next to them are dash functions, they move the player in the direction specified and the units next to the name
function up1() {
    if (player.getY()<=temp-32) {
        player.setPosition(player.getX(),174.5)
        player.gridy-=1
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(up1)
    } else {
        if (player.getY()>temp-16) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getY()-offset<=temp-32) {
            player.setPosition(player.getX(),174.5)
            player.gridy-=1
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(up1)
        } else {
            player.move(0,-1*offset)
        }
        
    }
    
}
function down1() {
    if (player.getY()>=temp+32) {
        player.setPosition(player.getX(),398.5)
        player.gridy++
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(down1)
    } else {
        if (player.getY()<temp+16) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getY()+offset>=temp+32) {
            player.setPosition(player.getX(),398.5)
            player.gridy++
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(down1)
        } else {
            player.move(0,1*offset)
        }
        
    }
    
}
function left1() {
    if (player.getX()<=temp-32) {
        player.setPosition(67.5,player.getY())
        player.gridx-=1
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(left1)
    } else {
        if (player.getX()>temp-16) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getX()-offset>=temp-32) {
            player.setPosition(67.5,player.getY())
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(left1)
        } else {
            player.move(-1*offset,0)
        }
        
    }
    
}
function right1() {
    if (player.getX()>=temp+32) {
        player.setPosition(547.5,player.getY())
        player.gridx++
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(right1)
    } else {
        if (player.getX()<temp+16) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getX()+offset>=temp+32) {
            player.setPosition(547.5,player.getY())
            player.gridx++
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(right1)
        } else {
            player.move(offset,0)
        }
        
    }
    
}
//dash indicator
let dsh
dsh = new webobj("https://codehs.com/uploads/15f26fea412d996e8028402649772229",102/2.5,96/2.3,0,getHeight()-50,1,"dsh indicator")
add(dsh)
let coldn
//provides a cooldown for the dash
function rolecldn() {
    remove(dsh)
    coldn++
    if (coldn == 100) {
        add(dsh)
        dashing = false
        stopTimer(rolecldn)
    }
}
function up2() {
    if (player.getY()<=temp-64) {
        player.setPosition(player.getX(),temp-64)
        player.gridy-=2
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(up2)
    } else {
        if (player.getY()>temp-32) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getY()-offset<=temp-64) {
            player.setPosition(player.getX(),temp-64)
            player.gridy-=2
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(up2)
        } else {
            player.move(0,-1*offset)
        }
    }
    
}

function down2() {
    if (player.getY()>=temp+64) {
        player.setPosition(player.getX(),temp+64)
        player.gridy+=2
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(down2)
    } else {
        if (player.getY()<temp+32) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getY()+offset>=temp+64) {
            player.setPosition(player.getX(),temp+64)
            player.gridy+=2
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(down2)
        } else {
            player.move(0,1*offset)
        }
    }
    
}
function left2() {
    if (player.getX()<=temp-64) {
        player.setPosition(temp-64,player.getY())
        player.gridx-=2
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(left2)
    } else {
        if (player.getX()>temp-32) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getX()-offset<=temp-64) {
            player.setPosition(temp-64,player.getY())
            player.gridx-=2
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(left2)
        } else {
            player.move(-1*offset,0)
        }
    }
    
}
function right2() {
    if (player.getX()>=temp+64) {
        player.setPosition(temp+64,player.getY())
        player.gridx+=2
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(right2)
    } else {
        if (player.getX()<temp+32) {
            offset = 2*offset
        } else {
            offset = 0.5*offset
        }
        if (player.getX()+offset>=temp+64) {
            player.setPosition(temp+64,player.getY())
            player.gridx+=2
            player.iframe = false
            for (let heart of heartls) {
                heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
                heart.setSize(50,50)
            }
            player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
            stopTimer(right2)
        } else {
            player.move(offset,0)
        }
    }
    
}


//smooth movement code
function smoothup() {
    if (player.getY()<=temp-32) {
        cldn = false
        
        player.setPosition(player.getX(),temp-32)
        //console.log("set player")
        //console.log(player.getY())
        player.gridy-=1
        
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(smoothup)
        tmpw = false
    }
    if (cldn == true) {
        if (player.getY() > temp-15) {
        offset = 1.5*offset
        } else {
            offset = offset/1.5
        }
        player.move(0,-1*offset)
    }
    
}
function smoothdown() {
    if (player.getY()>=temp+32) {
        cldn = false
        tmps = false
        player.setPosition(player.getX(),temp+32)
        //console.log("set player")
        //console.log(player.getY())
        player.gridy++
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(smoothdown)
    }
    if (cldn == true) {
        if (player.getY() < temp+15) {
        offset = 1.5*offset
        } else {
            offset = offset/1.5
        }
        player.move(0,offset)
    }
    
}
function smoothleft() {
    if (player.getX()<=temp-32) {
        cldn = false
        tmpa = false
        player.setPosition(temp-32, player.getY())
        //console.log("set player")
        //console.log(player.getY())
        player.gridx-=1
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(smoothleft)
    }
    if (cldn == true) {
        if (player.getX() > temp-15) {
        offset = 1.5*offset
        } else {
            offset = offset/1.5
        }
        player.move(-1*offset, 0)
    }
    
    
}
function smoothright() {
    if (player.getX()>=temp+32) {
        cldn = false
        tmpd = false
        player.setPosition(temp+32, player.getY())
        //console.log("set player")
        //console.log(player.getY())
        player.gridx++
        player.setImage("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b")
        stopTimer(smoothright)
    }
    if (cldn == true) {
        if (player.getX() < temp+15) {
        offset = 1.5*offset
        } else {
            offset = offset/1.5
        }
        player.move(offset, 0)
    }
}
//takes 0.2 seconds to move, 200 ms
//bg
//adds the platform
let plafmX = getWidth()/5 * 4 +2
let plafmY = 258 
let rect = new obj(plafmX,plafmY,getWidth()/2-plafmX/2,getHeight()/2-70,"#4b4861",1)
add(rect)
//player
let rx = Randomizer.nextInt(0,15)
let ry = Randomizer.nextInt(0,7)
let startx = 2+rect.getX() + 2.5 + rx*30 + 2*rx
let starty = 2+rect.getY() + 2.5 + ry*30 + 2*ry
let startgridx 
let startgridy=1
let inc = 0
//establishes grid coordinates for the player
if (startx == 67.5) {
    startgridx = 1
} else {
    for (let x = 67.5;x<startx;x+=32) {
        inc++
        startgridx = 1+inc
    }
}
inc = 0
if (starty == 174.5) {
    startgridy
} else {
    for (let y = 174.5;y<starty;y+=32) {
        inc++
        startgridy = 1+inc
    }
}
//initializes player
let player = new plyer("https://codehs.com/uploads/dd9ff4cc5a5e503004b84cf463c51c4b",25,25,startx,starty,10,"player",3,false,false,startgridx,startgridy)
add(player)
//health
let heartls = []
for (let i = 0; i<player.lives; i++) {
        let hp = new webobj("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6",50,50,-50+(getWidth()/2)-(i*50)+(i*90),getHeight()-50, 10, "hp")
        add(hp)
        heartls.push(hp)
}
//health update
function hpup() {
    //console.log(player.getX()+", " + player.getY())
    //removes heart
    if (heartls.length != player.lives && heartls.length >0) {
        remove(heartls.pop())
    }
    //death code
    if (player.lives == 0) {
        removeAll()
        let rect = new obj(getWidth(),getHeight(),0,0,"black",100,"bg")
        add(rect)
        let txt = new Text("You Died!", "30pt Sedan")
        txt.setPosition(250,getHeight()/2)
        txt.setColor("#af0d06")
        txt.layer = 101
        add(txt)
        stopTimer(hpup)
        stopTimer(hit)
        stopTimer(bshpup)
        stopTimer(MoveBs);
        stopTimer(attackPicker)
        stopTimer(keychecker)
        throw new Error("You Died!")
    }
    //win screen
    if(bs.phase==5) {
        removeAll();
        let rect5 = new obj(getWidth(),getHeight(),0,0,"black",40,"bg")
        add(rect5)
        let sadboi = new webobj("https://codehs.com/uploads/e51cd2d1bf61d8d6cf7fb95655293ed1",374,350,getWidth()/2-0.5*374,150,41,"he sad man bc he lose :(" )
        add(sadboi)
        let txt = new Text("You Won!", "30pt Sedan")
        txt.setPosition(230,150)
        txt.setColor("#f6c234")
        txt.layer = 42
        add(txt)
        stopTimer(hpup)
        stopTimer(hit)
        stopTimer(bshpup)
        stopTimer(MoveBs);
        stopTimer(attackPicker)
        stopTimer(keychecker)
        win()
    }
}
function win() {
    throw new Error("You won!")
}
//hit detection
function hit() {
    if (player.iframe == false) {
        for (let x = player.getX(); x<player.getX()+player.width; x++) {
            for (let y = player.getY(); y<player.getY()+player.height; y++) {
                if (getElementAt(x,y) != null) {
                    if (getElementAt(x,y).id == "atk") {
                        player.lives = player.lives - 1
                        player.iframe = true
                        cnt = 0
                        for (let heart of heartls) {
                            heart.setImage("https://codehs.com/uploads/59e077b1b934f50bebfdb06e1afc3fe0")
                            heart.setSize(50,50)
                        }
                        setTimer(ifame, 1)
                        return
                        
                    } 
                }
            }
        }
    }
        
}
//iframe code
let cnt = -1
function ifame() {
    cnt = cnt + 1
    if (cnt == 150) {
        cnt = -1
        player.iframe = false
        for (let heart of heartls) {
            heart.setImage("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6")
            heart.setSize(50,50)
        }
        stopTimer(ifame)
    }
}
//bosshealth
//goated function name btw
//adds boss health bar
let rect2 = new obj(bs.health*2,10,getWidth()/2-100,20,"grey",10,"bg")
add(rect2)
let rect1
rect1 = new obj(bs.health*2,10,getWidth()/2-100,20,"red",10,"boss_hp")
add(rect1)
let rect3 = new obj(bs.health*2,10,getWidth()/2-100,20,"grey",10,"bg")
rect3.setBorder(true)
rect3.setBorderColor("black")
rect3.setBorderWidth(2)
rect3.setFilled(false)
add(rect3)
function bshpup() {
    if (rect1.getWidth()!=bs.health*2) {
        rect1.setWidth(bs.health*2)
    }
}
//platform

//sets up grid
function grid() {
    for (let x = 0; x<16;x++) {
        for (let y = 0; y<8;y++) {
            grd = new obj(30,30,2+rect.getX()+(x*30)+(x*2),2+rect.getY()+(y*30)+(y*2),"#5b5a66",8)
            add(grd)
        }
    }
}

//console.log(player.getX())
let velocity = -.2
let atkCount
let atk1y
let atk2y
//sets up attack number1
function atk1(){
    bs.setImage("https://codehs.com/uploads/e96297058acae4d8c489dedfb66421a4")
    bs.setSize(325/3,259/3)
    velocity = -.2
    hand1_atk = new webobj("https://codehs.com/uploads/880ac01ee61f01ac6cb79624edcda9d1",25,61,1000,1000,15,"atk")
    hand2_atk = new webobj("https://codehs.com/uploads/12a92ee073e7da845a6c3b374208ff08",25,61,1000,1000,15,"atk")
    add(hand1_atk)
    remove(hand1)
    atk1y = Randomizer.nextInt(0,6);
    atk2y = Randomizer.nextInt(0,6);
    hand1_atk.setPosition(getWidth(),172.5+(atk2y*32));
    hand2_atk.setPosition(0,172.5+(atk1y*32));
    atkCount = 0
    setTimer(movehandatk1, 20);
}
//moves attack number one
function movehandatk1(){
    if(velocity<0){
        hand1_atk.move(velocity,0)
        velocity-=.5
    }else{
        hand2_atk.move(velocity,0)
        velocity+=.5
    }
    if(hand1_atk.getX()<=0){
        atkCount+=1
        remove(hand2)
        add(hand1)
        hand1_atk.move(2,0)
        velocity=.1
        remove(hand1_atk)
        add(hand2_atk)
        atk1y = Randomizer.nextInt(0,6);
        hand2_atk.setPosition(0,172.5+(atk1y*32));
    }
    if(hand2_atk.getX()>=getWidth()){
        atkCount+=1
        remove(hand1)
        add(hand2)        
        hand2_atk.move(-2,0)
        velocity=-.1
        remove(hand2_atk)
        add(hand1_atk)
        atk2y = Randomizer.nextInt(0,6);
        hand1_atk.setPosition(getWidth(),172.5+(atk2y*32));
    }
    if (atkCount==11){
        add(hand2)
        remove(hand2_atk)
        remove(hand1_atk)
        stopTimer(atk1)
        atkCount=0
        bs.setImage("https://codehs.com/uploads/4c63ebf0443cc84aab1661b481f8bd31")
        bs.setSize(325/3,259/3)
        attacking-=1
        atk1atking = false
        stopTimer(movehandatk1)
        
    }
    
}
//initializes hands for attak 2
let hand1_atk2 = new webobj("https://codehs.com/uploads/b83f34bcbb940b18e644200601bf9de3",62*3/2,25,1000,1000,15,"atk")
let hand2_atk2 = new webobj("https://codehs.com/uploads/7a9fd5f29f8031f4d481dcdfae21234f",62*3/2,25,1000,1000,15,"atk")
let velocity2
let velocity3

function atk2(){
    bs.setImage("https://codehs.com/uploads/e96297058acae4d8c489dedfb66421a4")
    bs.setSize(325/3,259/3)
    velocity2=.1
    velocity3=-.1   
    setTimer(atk2move,20)
    add(hand1_atk2)
    add(hand2_atk2)
}
//functions used for timeout
function velocity2up(){
    velocity2=-.1
}
function velocity2dwn(){
    velocity2=.1
}
function velocity1up(){
    velocity3=-.1
}
function velocity1dwn(){
    velocity3=.1
}
//starting the atk
let atk2Count=0
let hand1x = Randomizer.nextInt(0,13);
let hand2x = Randomizer.nextInt(0,13);
hand1_atk2.setPosition(65+((hand1x)*32),plafmY+(getHeight()/2-70));
hand2_atk2.setPosition(65+((hand2x)*32),getHeight()/2-95);
function atk2move(){
    if (atk2Count<=3){
        //hand2
        if (velocity2>0&&hand2_atk2.getY()+velocity2<(getHeight()/2-70)+plafmY&&velocity2!=0){
            hand2_atk2.move(0,velocity2)
            velocity2+=.2
        }else if (velocity2>0&&velocity2!=0){
            hand2_atk2.move(0,(getHeight()/2-70)+plafmY-hand2_atk2.getY())
            velocity2=0
            hand2x = Randomizer.nextInt(0,13);
            hand2_atk2.setImage("https://codehs.com/uploads/b83f34bcbb940b18e644200601bf9de3")
            hand2_atk2.setSize(62*3/2,25)
            hand2_atk2.setPosition(65+((hand2x)*32),plafmY+(getHeight()/2-70));
            setTimeout(velocity2up,800)
        }
            if (velocity2<0&&hand2_atk2.getY()+velocity2>(getHeight()/2-95)&&velocity2!=0){
            hand2_atk2.move(0,velocity2)
            velocity2-=.2
        }else if (velocity2<0&&velocity2!=0){
            hand2_atk2.move(0,hand2_atk2.getY()-(getHeight()/2-84))
            velocity2=0
            hand2x = Randomizer.nextInt(0,13);
            hand2_atk2.setImage("https://codehs.com/uploads/7a9fd5f29f8031f4d481dcdfae21234f")
            hand2_atk2.setSize(62*3/2,25)
            hand2_atk2.setPosition(65+((hand2x)*32),(getHeight()/2-95));
            setTimeout(velocity2dwn,800)
        }
        //hand1
        if (velocity3>0&&hand1_atk2.getY()+velocity3<(getHeight()/2-70)+plafmY&&velocity3!=0){
            hand1_atk2.move(0,velocity3)
            velocity3+=.2
        }else if (velocity3>0&&velocity3!=0){
            hand1_atk2.move(0,(getHeight()/2-70)+plafmY-hand1_atk2.getY())
            velocity3=0
            hand1x = Randomizer.nextInt(0,13);
            hand1_atk2.setImage("https://codehs.com/uploads/b83f34bcbb940b18e644200601bf9de3")
            hand1_atk2.setSize(62*3/2,25)
            hand1_atk2.setPosition(65+((hand1x)*32),plafmY+(getHeight()/2-70));
            setTimeout(velocity1up,800)
        }
            if (velocity3<0&&hand1_atk2.getY()+velocity3>(getHeight()/2-95)&&velocity3!=0){
            hand1_atk2.move(0,velocity3)
            velocity3-=.2
        }else if (velocity3<0&&velocity3!=0){
            hand1_atk2.move(0,hand1_atk2.getY()-(getHeight()/2-84))
            velocity3=0
            hand1x = Randomizer.nextInt(0,13);
            hand1_atk2.setImage("https://codehs.com/uploads/7a9fd5f29f8031f4d481dcdfae21234f")
            hand1_atk2.setSize(62*3/2,25)
            hand1_atk2.setPosition(65+((hand1x)*32),(getHeight()/2-95));
            setTimeout(velocity1dwn,800)
            atk2Count+=1
        }
    }else{
        //end
        remove(hand1_atk2);
        remove(hand2_atk2); 
        stopTimer(atk2move);
        bs.setImage("https://codehs.com/uploads/4c63ebf0443cc84aab1661b481f8bd31")
        bs.setSize(325/3,259/3)
        attacking-=1
        atk2atking = false
        atk2Count=0
    }
}
let bom
let bomx
let bomy
//sets up the bomb attack
function bombatk(){
    bs.setImage("https://codehs.com/uploads/e96297058acae4d8c489dedfb66421a4")
    bs.setSize(325/3,259/3)
    bom = new WebImage("https://codehs.com/uploads/fbe2f3874ff9fa5b7b274c11fc830c20")
    bom.setSize(25,25)
    bomx = Randomizer.nextInt(2,14)
    bomy = Randomizer.nextInt(2,6)
    bom.layer = 9
    bom.setPosition(67.5+((bomx-1)*32),174.5+((bomy-1)*32))
    add(bom)
    setTimeout(bombexpl,1000)
}
let bomexpl
//removes the bomb
function remoeve(){
    bs.setImage("https://codehs.com/uploads/4c63ebf0443cc84aab1661b481f8bd31")
    bs.setSize(325/3,259/3)
    attacking-=1
    atk3atking = false
    remove(bomexpl)
    remove(bom)
}
//explodes the bomb
function bombexpl(){
    bomexpl = new webobj("https://codehs.com/uploads/ff3d8a433a78927a79db54914ccabc88",25*4-2.5,25*4-2.5,63.3+((bomx-2)*32),174.5-4.2+((bomy-2)*32),15,"atk")
    add(bomexpl)
    setTimeout(remoeve,300)
}
//initializes variables for the fourth attack
let proj = new Rectangle(5,5)
proj.id = "atk"
proj.setPosition(67.5,174.5)
proj.layer = 15
proj.setColor("#ebae88")
let atk4count = 0
let moving = false
let projgridx
let projgridy
let status = "down"
let pacman = new webobj("https://codehs.com/uploads/12bda33e98724a3216179e1a29a940c5",30,30,65.5,172.5,16,"atk")
let pacmanmoving = false
let pacmangridx = 1
let pacmangridy = 1
let pacmanstatus = "down"
//sets up movement for pacman
function pcmanMove() {
    if (pacmangridx == 16 && pacmangridy ==1) {
        remove(pacman)
        stopTimer(pcmanMove)
        attacking-=1
        atk4atking = false
    } else if (pacmanmoving == false){
        pacmanmoving = true
        if (pacmangridy == 8 && pacmanstatus == "down") {
            pacmanstatus = "up"
            setTimeout(movepcman,200,"right")
        } else if (pacmanstatus == "down") {
            setTimeout(movepcman,200,"down")
        } else if (pacmangridy == 1 && pacmanstatus == "up") {
            pacmanstatus = "down"
            setTimeout(movepcman,200,"right")
        } else if (pacmanstatus == "up") {
            setTimeout(movepcman,200,"up")
        }
    }
}
//moves pacman
function movepcman(d) {
    if (d == "right") {
        pacman.setRotation(180)
        pacman.move(32,0)
        pacmangridx++
        pacmanmoving = false
    }
    if (d == "down") {
        pacman.setRotation(270)
        pacman.move(0,32)
        pacmangridy++
        pacmanmoving = false
    }
    if (d == "up") {
        pacman.setRotation(90)
        pacman.move(0,-32)
        pacmangridy-=1
        pacmanmoving = false
    }
}
//sets up atack 4
function atk4() {
    pacman.setPosition(65.5,172.5)
    pacmangridx=1
    pacmangridy=1
    pacmanmoving = false
    pacmanstatus = "down"
    pacman.setRotation(270)
    add(pacman)
    trail = []
    bs.setImage("https://codehs.com/uploads/e96297058acae4d8c489dedfb66421a4")
    bs.setSize(325/3,259/3)
    proj.setPosition(67.5+20/2,174.5+20/2)
    status = "down"
    projgridx = 1
    projgridy = 1
    atk4count = 0
    add(proj)
    setTimer(atk4move,1)
    setTimeout(startpcman,1000)
}
let pacount
//starts pacman
function startpcman() {
    setTimer(pcmanMove,1)
    pacount = 1
    setTimer(pacmanskin,4)
}
//changes the look of pacman
function pacmanskin() {
    if (pacount % 2 == 0) {
        pacman.setImage("https://codehs.com/uploads/12bda33e98724a3216179e1a29a940c5")
        pacman.setSize(30,30)
    } else {
        pacman.setImage("https://codehs.com/uploads/c91ce1e232314b05e9795845cdda326d")
        pacman.setSize(30,30)
    }
    pacount++
}
//moves the pellets
function atk4move() {
    if (projgridx == 16 && projgridy ==1) {
        remove(proj)
        attacking-=1
        for (let item of trail) {
            remove(item)
        }
        trail = []
        stopTimer(atk4move)
    } else if (moving == false){
        moving = true
        if (projgridy == 8 && status == "down") {
            status = "up"
            setTimeout(moveatk4,200,"right")
        } else if (status == "down") {
            setTimeout(moveatk4,200,"down")
        } else if (projgridy == 1 && status == "up") {
            status = "down"
            setTimeout(moveatk4,200,"right")
        } else if (status == "up") {
            setTimeout(moveatk4,200,"up")
        }
        

    }
}
//sets up the pellets
let trail = []
function moveatk4(d) {
    if (trail.length<4) {
        let t = new Rectangle(5,5)
        t.setPosition(proj.getX()+(0.5*proj.getWidth()-(2.5)),proj.getY()+(0.5*proj.getWidth()-(2.5)))
        t.setColor("#ebae88")
        t.layer = 15
        t.id = "atk"
        add(t)
        trail.push(t)
    } else {
        remove(trail[0])
        trail.remove(0)
        let t = new Rectangle(5,5)
        t.setPosition(proj.getX()+(0.5*proj.getWidth()-(2.5)),proj.getY()+(0.5*proj.getWidth()-(2.5)))
        t.setColor("#ebae88")
        t.layer = 15
        t.id = "atk"
        add(t)
        trail.push(t)
    }
    
    if (d == "right") {
        proj.move(32,0)
        projgridx++
        moving = false
    }
    if (d == "down") {
        proj.move(0,32)
        projgridy++
        moving = false
    }
    if (d == "up") {
        proj.move(0,-32)
        projgridy-=1
        moving = false
    }
    
}
//bombatk()
let key
let keyx
let keyy
//adds key to screen
function keyf() {
    keyx = Randomizer.nextInt(2,16)
    keyy = Randomizer.nextInt(2,8)
    if (keyx == player.gridx && keyy == player.gridy) {
        if (keyx == 1) {
            keyx+=5
        } else if (keyx == 16) {
            keyx-=5
        } else {
            keyx+=1
        }
        if (keyy == 1) {
            keyy+=3
        } else if (keyy == 8) {
            keyy-=3
        } else {
            keyy+=1
        }
    }
    key = new webobj("https://codehs.com/uploads/ba842dbf61f2838121a5d26c100c642b",30,30,65+((keyx-1)*32),172+((keyy-1)*32),9,"key");
    
    add(key)
}
let keyhole
let keyholex
let keyholey
//adds keyhole to screen
function khol() {
    if ((keyholex == keyx && keyholey == keyy)||(keyholex == player.gridx && keyholey == player.gridy)) {
        if (keyholex == 1) {
            keyholex+=5
        } else if (keyholex == 16) {
            keyholex-=5
        } else {
            keyholex+=1
        }
        if (keyholey == 1) {
            keyholey+=3
        } else if (keyholey == 8) {
            keyholey-=3
        } else {
            keyholey+=1
        }
    }
    keyholex = Randomizer.nextInt(1,16);
    keyholey = Randomizer.nextInt(1,8);
    keyhole = new webobj("https://codehs.com/uploads/a2942378831f2f98e38a95e9a176b80a",30,30,65+((keyholex-1)*32),172+((keyholey-1)*32),9,"keyhole");
    add(keyhole);
}
//sets up variables needed to check keys
let cent
let newkey = false
let restoring = false
let cent1
let kyicn = new webobj("https://codehs.com/uploads/ba842dbf61f2838121a5d26c100c642b",221/2.5,185/2.5,getWidth()-221/2.5-10,getHeight()-60,10,"key icon")
let temperoni
//checks for keys
function keychecker() {
    if (bs.health == 0 ) {
        restoring = true
        bs.phase+=1
        cent1 = 0
        setTimer(smthrestor,1)
    }
    if (restoring == false) {
        if (newkey == true) {
            keyf();
            khol();
            newkey = false
        }
        //console.log("P: " + player.gridx + ", " + player.gridy + "    K: " + keyholex + ", " + keyholey)
        if (player.haskey == false && player.gridx == keyx && player.gridy == keyy) {
            player.haskey = true
            add(kyicn)
            remove(key)
        }
        if (player.haskey == true && player.gridx == keyholex && player.gridy == keyholey) {
            remove(kyicn)
            player.haskey = false
            remove(keyhole)
            temperoni = bs.health
            cent = 0
            setTimer(smoothhp,1)
        }
    }
    
}
//makes the hp changes smooth
function smoothhp() {
    if(bs.health == temperoni-20) {
        newkey = true
        stopTimer(smoothhp)
    } else {
        bs.health-=1
        bs.setImage("https://codehs.com/uploads/b6b39b2f30d0c5a2c2d2e46d78389ee0")
        bs.setSize(325/3,259/3)
    }
    
}
//makes the restoration restored
function smthrestor() {
    if(cent1 == 100) {
        restoring = false
        if (player.lives<3) {
            while(true) {
                if (player.lives<3) {
                    player.lives++
                    let hp = new webobj("https://codehs.com/uploads/74adb91d2f80499a85d55515fdac09d6",50,50,-50+(getWidth()/2)-((player.lives-1)*50)+((player.lives-1)*90),getHeight()-50, 10, "hp")
                    add(hp)
                    heartls.push(hp)
                    continue
                } else {
                    break
                }
                
            }
        }
        stopTimer(smthrestor)
    } else {
        cent1++
        bs.health++
    }
    
}
console.log("CONTROLS:\n\n-Movement: WASD/Arrow Keys\n-Dash: q,shift, or space\n*Please note that in order to dash, you must first hold down a dash key, then provide a directional input*\n*Dash cooldown is indicated by the icon in the lower left-hand corner*")
main();