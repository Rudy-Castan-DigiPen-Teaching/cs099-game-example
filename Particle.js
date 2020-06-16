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

class Particle
{
	constructor()
	{
		this.pos = createVector();
		this.scale = 0;
		this.velocity = createVector();
		this.countdown = 0;
		this.lifespan = 0;
		this.fillColor = color(0);
		this.isDead = true;
		this.damping = 0.99;
	}

	Reset(position, velocity)
	{
		this.pos = position;
		this.velocity = velocity;
		this.scale = random(6,8);
		this.countdown = random(0.5, 0.75);
		this.lifespan = (this.countdown);
		this.fillColor = color(int(random(256)), int(random(256)), int(random(256)), 255);
		this.isDead = false;
	}

	Update(delta_time)
	{
		if(this.isDead)
			return;

		this.pos.add(p5.Vector.mult(this.velocity, delta_time));
		this.velocity.mult(this.damping);
		this.countdown -= delta_time;
		this.isDead = (this.countdown <= 0);
		this.fillColor.setAlpha(map(this.countdown, this.lifespan, 0, 255, 0));
	}

	Draw()
	{
		if(this.isDead)
			return;

		noStroke();
		fill(this.fillColor);
		rect(this.pos.x, this.pos.y, this.scale, this.scale);
	}
}


class ParticleEmitter
{
	constructor()
	{
		this.isDead = true;
		this.particles = [];
	}

	Reset(center)
	{
		let length = int(random(30, 50));
		while(this.particles.length < length)
			this.particles.push(new Particle());
		for (let i = 0; i < length; ++i) {
			let angle = random(0, TWO_PI);
			this.particles[i].Reset(createVector(center.x, center.y), p5.Vector.fromAngle(angle, random(50, 150)));
		}
		this.isDead = false;
	}

	Update(delta_time)
	{		
		if(this.isDead)
			return;

		this.isDead = true;

		for(let p of this.particles)
		{
			p.Update(delta_time);
			this.isDead = this.isDead && p.isDead;
		}
	}

	Draw()
	{
		if(this.isDead)
			return;

		for(let p of this.particles)
		{
			p.Draw();
		}
	}

	ShutDown()
	{
		for(let p of this.particles)
			p.isDead = true;
		this.isDead = true;
	}
}