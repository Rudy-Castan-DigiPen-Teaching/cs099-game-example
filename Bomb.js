// MIT License
//
// Copyright (c) 2019 Rudy Darth Castan, Minui Lee
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

class Bomb {
	constructor() {
		this.pos = createVector();
		this.radius = 32;
		this.blastRadius;
		this.isDead = true;
		this.isExploding = false;
		this.explosionEmitter = new ParticleEmitter();
	}

	Reset(center) {
		this.radius = random(16, 32);
		this.blastRadius = this.radius;
		let angle = random(0, TWO_PI);
		this.pos = p5.Vector.add(center, p5.Vector.fromAngle(angle).mult(random(1,width/2)));
		this.pos.x = constrain(this.pos.x, this.radius, width - this.radius);
		this.pos.y = constrain(this.pos.y, this.radius, height - this.radius);
		this.isDead = false;
		this.explosionEmitter.Reset(this.pos);
		this.isExploding = false;
	}

	Update(delta_time) {
		if (this.isDead)
			return;

		if (this.isExploding) {
			this.explosionEmitter.Update(delta_time);
			this.isDead = this.explosionEmitter.isDead;
			return;
		}

		this.radius -= 0.2;
		if (this.radius <= 2)
		{
			this.isExploding = true;
			playExplosionSfx();
		}
	}

	Draw() {
		if (this.isDead)
			return;

		if (!this.isExploding) {
			strokeWeight(2);
			stroke('#C1C490');
			fill('#88A24F');
			ellipse(this.pos.x, this.pos.y, this.radius * 2);
		} else {
			this.explosionEmitter.Draw();
		}
	}

	ShutDown()
	{
		this.isDead = true;
		this.isExploding = false;
		this.explosionEmitter.ShutDown();
	}
}