// ECMAScript 5 strict mode
"use strict";

var Box2D = {};
Box2D.Dynamics         = {};
Box2D.Dynamics.Joints  = {};
Box2D.Common           = {};
Box2D.Common.Math      = {};
Box2D.Collision        = {};
Box2D.Collision.Shapes = {};

function c2inherit(derived, base)
{
	for (var i in base.prototype)
	{
		if (base.prototype.hasOwnProperty(i))
			derived.prototype[i] = base.prototype[i];
	}
};

////////////////////////////////////////////////////////////////////////
// Box2DWeb physics implementation
Box2D.Collision.b2Collision = {};
Box2D.Collision.b2Distance = {};
Box2D.Common.b2Settings = {};
Box2D.Common.Math.b2Math = {};
Box2D.Consts = {};
Box2D.Dynamics.Contacts = {};
Box2D.Dynamics.Controllers = {};

/**
 * Creates a callback function
 * @param {!Object} context The context ('this' variable) of the callback function
 * @param {function(...[*])} fn The function to execute with the given context for the returned callback
 * @return {function()} The callback function
 */
Box2D.generateCallback = function(context, fn) {
	return function() {
		fn.apply(context, arguments);
	};
};

/**
 * @type {number}
 * @const
 */
Box2D.Consts.MIN_VALUE_SQUARED = Number.MIN_VALUE * Number.MIN_VALUE;

/**
 * @param {number} friction1
 * @param {number} friction2
 */
Box2D.Common.b2Settings.b2MixFriction = function (friction1, friction2) {
	return Math.sqrt(friction1 * friction2);
};

/**
 * @param {number} restitution1
 * @param {number} restitution2
 */
Box2D.Common.b2Settings.b2MixRestitution = function (restitution1, restitution2) {
	return restitution1 > restitution2 ? restitution1 : restitution2;
};

Box2D.Common.b2Settings.VERSION = "2.1alpha-illandril";
Box2D.Common.b2Settings.USHRT_MAX = 0x0000ffff;
Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
Box2D.Common.b2Settings.b2_aabbMultiplier = 2.0;
Box2D.Common.b2Settings.b2_polygonRadius = 2.0 * Box2D.Common.b2Settings.b2_linearSlop;
Box2D.Common.b2Settings.b2_linearSlop = 0.005;
Box2D.Common.b2Settings.b2_angularSlop = 2.0 / 180.0 * Math.PI;
Box2D.Common.b2Settings.b2_toiSlop = 8.0 * Box2D.Common.b2Settings.b2_linearSlop;
Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32;
Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32;
Box2D.Common.b2Settings.b2_velocityThreshold = 1.0;
Box2D.Common.b2Settings.b2_maxLinearCorrection = 0.2;
Box2D.Common.b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * Math.PI;
Box2D.Common.b2Settings.b2_maxTranslation = 2.0;
Box2D.Common.b2Settings.b2_maxTranslationSquared = Box2D.Common.b2Settings.b2_maxTranslation * Box2D.Common.b2Settings.b2_maxTranslation;
Box2D.Common.b2Settings.b2_maxRotation = 0.5 * Math.PI;
Box2D.Common.b2Settings.b2_maxRotationSquared = Box2D.Common.b2Settings.b2_maxRotation * Box2D.Common.b2Settings.b2_maxRotation;
Box2D.Common.b2Settings.b2_contactBaumgarte = 0.2;
Box2D.Common.b2Settings.b2_timeToSleep = 0.5;
Box2D.Common.b2Settings.b2_linearSleepTolerance = 0.01;
Box2D.Common.b2Settings.b2_linearSleepToleranceSquared = Box2D.Common.b2Settings.b2_linearSleepTolerance * Box2D.Common.b2Settings.b2_linearSleepTolerance;
Box2D.Common.b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * Math.PI;
Box2D.Common.b2Settings.b2_angularSleepToleranceSquared = Box2D.Common.b2Settings.b2_angularSleepTolerance * Box2D.Common.b2Settings.b2_angularSleepTolerance;
Box2D.Common.b2Settings.MIN_VALUE_SQUARED = Number.MIN_VALUE * Number.MIN_VALUE;

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.Dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.CrossVV = function (a, b) {
  return a.x * b.y - a.y * b.x;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {number} s
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.CrossVF = function (a, s) {
  return Box2D.Common.Math.b2Vec2.Get(s * a.y, (-s * a.x));
};

/**
 * @param {number} s
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.CrossFV = function (s, a) {
  return Box2D.Common.Math.b2Vec2.Get((-s * a.y), s * a.x);
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulMV = function (A, v) {
  return Box2D.Common.Math.b2Vec2.Get(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulTMV = function (A, v) {
  return Box2D.Common.Math.b2Vec2.Get(Box2D.Common.Math.b2Math.Dot(v, A.col1), Box2D.Common.Math.b2Math.Dot(v, A.col2));
};

/**
 * @param {!Box2D.Common.Math.b2Transform} T
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulX = function (T, v) {
  var a = Box2D.Common.Math.b2Math.MulMV(T.R, v);
  a.x += T.position.x;
  a.y += T.position.y;
  return a;
};

/**
 * @param {!Box2D.Common.Math.b2Transform} T
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulXT = function (T, v) {
  var a = Box2D.Common.Math.b2Math.SubtractVV(v, T.position);
  var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
  a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
  a.x = tX;
  return a;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.AddVV = function (a, b) {
  return Box2D.Common.Math.b2Vec2.Get(a.x + b.x, a.y + b.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.SubtractVV = function (a, b) {
  return Box2D.Common.Math.b2Vec2.Get(a.x - b.x, a.y - b.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.Distance = function (a, b) {
  var cX = a.x - b.x;
  var cY = a.y - b.y;
  return Math.sqrt(Box2D.Common.Math.b2Math.DistanceSquared(a,b));
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.DistanceSquared = function (a, b) {
  var cX = a.x - b.x;
  var cY = a.y - b.y;
  return (cX * cX + cY * cY);
};

/**
 * @param {number} s
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulFV = function (s, a) {
  return Box2D.Common.Math.b2Vec2.Get(s * a.x, s * a.y);
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Mat22} B
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.AddMM = function (A, B) {
  return Box2D.Common.Math.b2Mat22.FromVV(Box2D.Common.Math.b2Math.AddVV(A.col1, B.col1), Box2D.Common.Math.b2Math.AddVV(A.col2, B.col2));
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Mat22} B
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.MulMM = function (A, B) {
  return Box2D.Common.Math.b2Mat22.FromVV(Box2D.Common.Math.b2Math.MulMV(A, B.col1), Box2D.Common.Math.b2Math.MulMV(A, B.col2));
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Mat22} B
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.MulTMM = function (A, B) {
  var c1 = Box2D.Common.Math.b2Vec2.Get(Box2D.Common.Math.b2Math.Dot(A.col1, B.col1), Box2D.Common.Math.b2Math.Dot(A.col2, B.col1));
  var c2 = Box2D.Common.Math.b2Vec2.Get(Box2D.Common.Math.b2Math.Dot(A.col1, B.col2), Box2D.Common.Math.b2Math.Dot(A.col2, B.col2));
  return Box2D.Common.Math.b2Mat22.FromVV(c1, c2);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.AbsV = function (a) {
  return Box2D.Common.Math.b2Vec2.Get(Math.abs(a.x), Math.abs(a.y));
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.AbsM = function (A) {
  return Box2D.Common.Math.b2Mat22.FromVV(Box2D.Common.Math.b2Math.AbsV(A.col1), Box2D.Common.Math.b2Math.AbsV(A.col2));
};

/**
 * @param {number} a
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
Box2D.Common.Math.b2Math.Clamp = function (a, low, high) {
  return a < low ? low : a > high ? high : a;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} low
 * @param {!Box2D.Common.Math.b2Vec2} high
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.ClampV = function (a, low, high) {
	var x = Box2D.Common.Math.b2Math.Clamp(a.x, low.x, high.x);
	var y = Box2D.Common.Math.b2Math.Clamp(a.y, low.y, high.y);
  return Box2D.Common.Math.b2Vec2.Get(x, y);
};

/**
 * @constructor
 */
Box2D.Common.Math.b2Mat22 = function() {
	this.col1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.col2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.SetIdentity();
};

/**
 * @param {number} angle
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.FromAngle = function(angle) {
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.Set(angle);
	return mat;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} c1
 * @param {!Box2D.Common.Math.b2Vec2} c2
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.FromVV = function(c1, c2) {
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.SetVV(c1, c2);
	return mat;
};

/**
 * @param {number} angle
 */
Box2D.Common.Math.b2Mat22.prototype.Set = function(angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	this.col1.Set(c, s);
	this.col2.Set(-s, c);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} c1
 * @param {!Box2D.Common.Math.b2Vec2} c2
 */
Box2D.Common.Math.b2Mat22.prototype.SetVV = function(c1, c2) {
	this.col1.SetV(c1);
	this.col2.SetV(c2);
};

/**
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.prototype.Copy = function() {
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.SetM(this);
	return mat;
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} m
 */
Box2D.Common.Math.b2Mat22.prototype.SetM = function(m) {
	this.col1.SetV(m.col1);
	this.col2.SetV(m.col2);
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} m
 */
Box2D.Common.Math.b2Mat22.prototype.AddM = function(m) {
	this.col1.Add(m.col1);
	this.col2.Add(m.col2);
};

Box2D.Common.Math.b2Mat22.prototype.SetIdentity = function() {
	this.col1.Set(1, 0);
	this.col2.Set(0, 1);
};

Box2D.Common.Math.b2Mat22.prototype.SetZero = function() {
	this.col1.Set(0, 0);
	this.col2.Set(0, 0);
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Mat22.prototype.GetAngle = function() {
	return Math.atan2(this.col1.y, this.col1.x);
};

/**
 * @param {!Box2D.Common.Math.b2Mat22} out
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.prototype.GetInverse = function(out) {
	var det = this.col1.x * this.col2.y - this.col2.x * this.col1.y;
	if (det !== 0) {
		det = 1 / det;
	}
	out.col1.x = det * this.col2.y;
	out.col2.x = -det * this.col2.x;
	out.col1.y = -det * this.col1.y;
	out.col2.y = det * this.col1.x;
	return out;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} out
 * @param {number} bX
 * @param {number} bY
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Mat22.prototype.Solve = function(out, bX, bY) {
	var det = this.col1.x * this.col2.y - this.col2.x * this.col1.y;
	if (det !== 0) {
		det = 1 / det;
	}
	out.x = det * (this.col2.y * bX - this.col2.x * bY);
	out.y = det * (this.col1.x * bY - this.col1.y * bX);
	return out;
};

Box2D.Common.Math.b2Mat22.prototype.Abs = function() {
	this.col1.Abs();
	this.col2.Abs();
};

/**
 * @param {!Box2D.Common.Math.b2Vec3=} c1
 * @param {!Box2D.Common.Math.b2Vec3=} c2
 * @param {!Box2D.Common.Math.b2Vec3=} c3
 * @constructor
 */
Box2D.Common.Math.b2Mat33 = function(c1, c2, c3) {
	this.col1 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.col2 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.col3 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	if (c1) {
		this.col1.SetV(c1);
	}
	if (c2) {
		this.col2.SetV(c2);
	}
	if (c3) {
		this.col3.SetV(c3);
	}
};

/**
 * @param {!Box2D.Common.Math.b2Vec3} c1
 * @param {!Box2D.Common.Math.b2Vec3} c2
 * @param {!Box2D.Common.Math.b2Vec3} c3
 */
Box2D.Common.Math.b2Mat33.prototype.SetVVV = function(c1, c2, c3) {
	this.col1.SetV(c1);
	this.col2.SetV(c2);
	this.col3.SetV(c3);
};

/**
 * @return {!Box2D.Common.Math.b2Mat33}
 */
Box2D.Common.Math.b2Mat33.prototype.Copy = function() {
	return new Box2D.Common.Math.b2Mat33(this.col1, this.col2, this.col3);
};

/**
 * @param {!Box2D.Common.Math.b2Mat33} m
 */
Box2D.Common.Math.b2Mat33.prototype.SetM = function(m) {
	this.col1.SetV(m.col1);
	this.col2.SetV(m.col2);
	this.col3.SetV(m.col3);
};

/**
 * @param {!Box2D.Common.Math.b2Mat33} m
 */
Box2D.Common.Math.b2Mat33.prototype.AddM = function(m) {
	this.col1.x += m.col1.x;
	this.col1.y += m.col1.y;
	this.col1.z += m.col1.z;
	this.col2.x += m.col2.x;
	this.col2.y += m.col2.y;
	this.col2.z += m.col2.z;
	this.col3.x += m.col3.x;
	this.col3.y += m.col3.y;
	this.col3.z += m.col3.z;
};

Box2D.Common.Math.b2Mat33.prototype.SetIdentity = function() {
	this.col1.Set(1,0,0);
	this.col2.Set(0,1,0);
	this.col3.Set(0,0,1);
};

Box2D.Common.Math.b2Mat33.prototype.SetZero = function() {
	this.col1.Set(0,0,0);
	this.col2.Set(0,0,0);
	this.col3.Set(0,0,0);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} out
 * @param {number} bX
 * @param {number} bY
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Mat33.prototype.Solve22 = function(out, bX, bY) {
	var a11 = this.col1.x;
	var a12 = this.col2.x;
	var a21 = this.col1.y;
	var a22 = this.col2.y;
	var det = a11 * a22 - a12 * a21;
	if (det != 0.0) {
		det = 1.0 / det;
	}
	out.x = det * (a22 * bX - a12 * bY);
	out.y = det * (a11 * bY - a21 * bX);
	return out;
};

/**
 * @param {!Box2D.Common.Math.b2Vec3} out
 * @param {number} bX
 * @param {number} bY
 * @param {number} bZ
 * @return {!Box2D.Common.Math.b2Vec3}
 */
Box2D.Common.Math.b2Mat33.prototype.Solve33 = function(out, bX, bY, bZ) {
	var a11 = this.col1.x;
	var a21 = this.col1.y;
	var a31 = this.col1.z;
	var a12 = this.col2.x;
	var a22 = this.col2.y;
	var a32 = this.col2.z;
	var a13 = this.col3.x;
	var a23 = this.col3.y;
	var a33 = this.col3.z;
	var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
	if (det != 0.0) {
		det = 1.0 / det;
	}
	out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
	out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
	out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
	return out;
}

/**
 * @constructor
 */
Box2D.Common.Math.b2Sweep = function() {
	this.localCenter = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.c0 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.c = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Common.Math.b2Sweep.prototype.Set = function(other) {
	this.localCenter.SetV(other.localCenter);
	this.c0.SetV(other.c0);
	this.c.SetV(other.c);
	this.a0 = other.a0;
	this.a = other.a;
	this.t0 = other.t0;
};

Box2D.Common.Math.b2Sweep.prototype.Copy = function() {
	var copy = new Box2D.Common.Math.b2Sweep();
	copy.localCenter.SetV(this.localCenter);
	copy.c0.SetV(this.c0);
	copy.c.SetV(this.c);
	copy.a0 = this.a0;
	copy.a = this.a;
	copy.t0 = this.t0;
	return copy;
};

Box2D.Common.Math.b2Sweep.prototype.GetTransform = function(xf, alpha) {
	if (alpha === undefined) alpha = 0;
	xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
	xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
	var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
	xf.R.Set(angle);
	var tMat = xf.R;
	xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
	xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
};

Box2D.Common.Math.b2Sweep.prototype.Advance = function(t) {
	if (t === undefined) t = 0;
	if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
		var alpha = (t - this.t0) / (1.0 - this.t0);
		this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
		this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
		this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
		this.t0 = t;
	}
};

/**
 * @param {!Box2D.Common.Math.b2Vec2=} pos
 * @param {!Box2D.Common.Math.b2Mat22=} r
 * @constructor
 */
Box2D.Common.Math.b2Transform = function(pos, r) {
	this.position = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.R = new Box2D.Common.Math.b2Mat22();
	if (pos) {
		this.position.SetV(pos);
	}
	if (r) {
		this.R.SetM(r);
	}
};

Box2D.Common.Math.b2Transform.prototype.Initialize = function(pos, r) {
	this.position.SetV(pos);
	this.R.SetM(r);
};

Box2D.Common.Math.b2Transform.prototype.SetIdentity = function() {
	this.position.SetZero();
	this.R.SetIdentity();
};

Box2D.Common.Math.b2Transform.prototype.Set = function(x) {
	this.position.SetV(x.position);
	this.R.SetM(x.R);
};

Box2D.Common.Math.b2Transform.prototype.GetAngle = function() {
	return Math.atan2(this.R.col1.y, this.R.col1.x);
};

/**
 * @private
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Box2D.Common.Math.b2Vec2 = function(x, y) {
	this.x = x;
	this.y = y;
};


/**
 * @private
 * @type {Array.<!Box2D.Common.Math.b2Vec2>}
 */
Box2D.Common.Math.b2Vec2._freeCache = [];

/**
 * @param {number} x
 * @param {number} y
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.Get = function(x, y) {
	if (Box2D.Common.Math.b2Vec2._freeCache.length > 0) {
		var vec = Box2D.Common.Math.b2Vec2._freeCache.pop();
		vec.Set(x, y);
		return vec;
	}
	return new Box2D.Common.Math.b2Vec2(x, y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} vec
 */
Box2D.Common.Math.b2Vec2.Free = function(vec) {
	Box2D.Common.Math.b2Vec2._freeCache.push(vec);
};

Box2D.Common.Math.b2Vec2.prototype.SetZero = function() {
	this.x = 0.0;
	this.y = 0.0;
};

/**
 * @param {number} x
 * @param {number} y
 */
Box2D.Common.Math.b2Vec2.prototype.Set = function(x, y) {
	this.x = x;
	this.y = y;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.SetV = function(v) {
	this.x = v.x;
	this.y = v.y;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.prototype.GetNegative = function() {
	return Box2D.Common.Math.b2Vec2.Get((-this.x), (-this.y));
};

Box2D.Common.Math.b2Vec2.prototype.NegativeSelf = function() {
	this.x = (-this.x);
	this.y = (-this.y);
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.prototype.Copy = function() {
	return Box2D.Common.Math.b2Vec2.Get(this.x, this.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.Add = function(v) {
	this.x += v.x;
	this.y += v.y;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.Subtract = function(v) {
	this.x -= v.x;
	this.y -= v.y;
};

/**
 * @param {number} a
 */
Box2D.Common.Math.b2Vec2.prototype.Multiply = function(a) {
	this.x *= a;
	this.y *= a;
};

/**
 * @param {Box2D.Common.Math.b2Mat22} A
 */
Box2D.Common.Math.b2Vec2.prototype.MulM = function(A) {
	var tX = this.x;
	this.x = A.col1.x * tX + A.col2.x * this.y;
	this.y = A.col1.y * tX + A.col2.y * this.y;
};

/**
 * @param {Box2D.Common.Math.b2Mat22} A
 */
Box2D.Common.Math.b2Vec2.prototype.MulTM = function(A) {
	var tX = this.x * A.col1.x + this.y * A.col1.y;
	this.y = this.x * A.col2.x + this.y * A.col2.y;
	this.x = tX;
};

/**
 * @param {number} s
 */
Box2D.Common.Math.b2Vec2.prototype.CrossVF = function(s) {
	var tX = this.x;
	this.x = s * this.y;
	this.y = (-s * tX);
};

/**
 * @param {number} s
 */
Box2D.Common.Math.b2Vec2.prototype.CrossFV = function(s) {
	var tX = this.x;
	this.x = (-s * this.y);
	this.y = s * tX;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} b
 */
Box2D.Common.Math.b2Vec2.prototype.MinV = function(b) {
	this.x = Math.min(this.x, b.x);
	this.y = Math.min(this.y, b.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} b
 */
Box2D.Common.Math.b2Vec2.prototype.MaxV = function(b) {
	this.x = Math.max(this.x, b.x);
	this.y = Math.max(this.y, b.y);
};

Box2D.Common.Math.b2Vec2.prototype.Abs = function() {
	this.x = Math.abs(this.x);
	this.y = Math.abs(this.y);
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.Length = function() {
	return Math.sqrt(this.LengthSquared());
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.LengthSquared = function() {
	return (this.x * this.x + this.y * this.y);
};

/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.Normalize = function() {
	var length = this.Length();
	if (length < Number.MIN_VALUE) {
		return 0.0;
	}
	var invLength = 1.0 / length;
	this.x *= invLength;
	this.y *= invLength;
	return length;
};

/**
 * @return {boolean}
 */
Box2D.Common.Math.b2Vec2.prototype.IsValid = function () {
  return isFinite(this.x) && isFinite(this.y);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @constructor
 */
Box2D.Common.Math.b2Vec3 = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

Box2D.Common.Math.b2Vec3.prototype.SetZero = function() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
Box2D.Common.Math.b2Vec3.prototype.Set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

/**
 * @param {!Box2D.Common.Math.b2Vec3} v
 */
Box2D.Common.Math.b2Vec3.prototype.SetV = function(v) {
	this.x = v.x;
	this.y = v.y;
	this.z = v.z;
};

/**
 * @return {!Box2D.Common.Math.b2Vec3}
 */
Box2D.Common.Math.b2Vec3.prototype.GetNegative = function() {
	return new Box2D.Common.Math.b2Vec3((-this.x), (-this.y), (-this.z));
};

Box2D.Common.Math.b2Vec3.prototype.NegativeSelf = function() {
	this.x = (-this.x);
	this.y = (-this.y);
	this.z = (-this.z);
};

/**
 * @return {!Box2D.Common.Math.b2Vec3}
 */
Box2D.Common.Math.b2Vec3.prototype.Copy = function() {
	return new Box2D.Common.Math.b2Vec3(this.x, this.y, this.z);
};

/**
 * @param {!Box2D.Common.Math.b2Vec3} v
 */
Box2D.Common.Math.b2Vec3.prototype.Add = function(v) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
};

/**
 * @param {!Box2D.Common.Math.b2Vec3} v
 */
Box2D.Common.Math.b2Vec3.prototype.Subtract = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
};

/**
 * @param {number} a
 */
Box2D.Common.Math.b2Vec3.prototype.Multiply = function(a) {
	this.x *= a;
	this.y *= a;
	this.z *= a;
};

/**
 * @constructor
 */
Box2D.Collision.Shapes.b2Shape = function() {
	this.m_radius = Box2D.Common.b2Settings.b2_linearSlop;
};

/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2Shape.prototype.GetTypeName = function(){};

/**
 * @return {!Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2Shape.prototype.Copy = function(){};

/**
 * @param {!Box2D.Collision.Shapes.b2Shape} other
 */
Box2D.Collision.Shapes.b2Shape.prototype.Set = function(other) {
	this.m_radius = other.m_radius;
};

/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2Shape.prototype.TestPoint = function(){};

/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2Shape.prototype.RayCast = function(){};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} transform
 */
Box2D.Collision.Shapes.b2Shape.prototype.ComputeAABB = function(){};

/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2Shape.prototype.ComputeMass = function(){};

/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2Shape.prototype.ComputeSubmergedArea = function(){};

/**
 * @param {!Box2D.Collision.b2DistanceProxy} proxy
 */
Box2D.Collision.Shapes.b2Shape.prototype.SetDistanceProxy = function(){};

/**
 * @param {!Box2D.Collision.Shapes.b2Shape} shape1
 * @param {!Box2D.Common.Math.b2Transform} transform1
 * @param {!Box2D.Collision.Shapes.b2Shape} shape2
 * @param {!Box2D.Common.Math.b2Transform} transform2
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2Shape.TestOverlap = function(shape1, transform1, shape2, transform2) {
	var input = new Box2D.Collision.b2DistanceInput();
	input.proxyA = new Box2D.Collision.b2DistanceProxy();
	input.proxyA.Set(shape1);
	input.proxyB = new Box2D.Collision.b2DistanceProxy();
	input.proxyB.Set(shape2);
	input.transformA = transform1;
	input.transformB = transform2;
	input.useRadii = true;
	var simplexCache = new Box2D.Collision.b2SimplexCache();
	simplexCache.count = 0;
	var output = new Box2D.Collision.b2DistanceOutput();
	Box2D.Collision.b2Distance.Distance(output, simplexCache, input);
	return output.distance < 10.0 * Number.MIN_VALUE;
};

/**
 * @const
 * @type {number}
 */
Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = -1;

/**
 * @const
 * @type {number}
 */
Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;

/**
 * @const
 * @type {number}
 */
Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;

/**
 * @param {number} radius
 * @constructor
 * @extends {Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2CircleShape = function(radius) {
	Box2D.Collision.Shapes.b2Shape.call(this);
	/** @type {number} */
	this.m_radius = radius;
	
	/** @type {number} */
	this.m_radiusSquared = radius * radius;
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_p = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
c2inherit(Box2D.Collision.Shapes.b2CircleShape, Box2D.Collision.Shapes.b2Shape);

/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.GetTypeName = function() {
	return Box2D.Collision.Shapes.b2CircleShape.NAME;
};

/**
 * @return {!Box2D.Collision.Shapes.b2CircleShape}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.Copy = function() {
	var s = new Box2D.Collision.Shapes.b2CircleShape(this.m_radius);
	s.Set(this);
	return s;
};

/**
 * @param {!Box2D.Collision.Shapes.b2Shape} other
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.Set = function(other) {
	Box2D.Collision.Shapes.b2Shape.prototype.Set.call(this, other);
	if (other instanceof Box2D.Collision.Shapes.b2CircleShape) {
		this.m_p.SetV(other.m_p);
	}
};

/**
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.TestPoint = function(transform, p) {
	var tMat = transform.R;
	var dX = p.x - (transform.position.x + (transform.R.col1.x * this.m_p.x + transform.R.col2.x * this.m_p.y));
	var dY = p.y - (transform.position.y + (transform.R.col1.y * this.m_p.x + transform.R.col2.y * this.m_p.y));
	return (dX * dX + dY * dY) <= this.m_radiusSquared;
};

/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.RayCast = function(output, input, transform) {
	var tMat = transform.R;
	var positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
	var positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
	var sX = input.p1.x - positionX;
	var sY = input.p1.y - positionY;
	var b = (sX * sX + sY * sY) - this.m_radiusSquared;
	var rX = input.p2.x - input.p1.x;
	var rY = input.p2.y - input.p1.y;
	var c = (sX * rX + sY * rY);
	var rr = (rX * rX + rY * rY);
	var sigma = c * c - rr * b;
	if (sigma < 0.0 || rr < Number.MIN_VALUE) {
		return false;
	}
	var a = (-(c + Math.sqrt(sigma)));
	if (0.0 <= a && a <= input.maxFraction * rr) {
		a /= rr;
		output.fraction = a;
		output.normal.x = sX + a * rX;
		output.normal.y = sY + a * rY;
		output.normal.Normalize();
		return true;
	}
	return false;
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} transform
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.ComputeAABB = function(aabb, transform) {
	var tMat = transform.R;
	var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
	var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
	aabb.lowerBound_.Set(pX - this.m_radius, pY - this.m_radius);
	aabb.upperBound_.Set(pX + this.m_radius, pY + this.m_radius);
};

/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.ComputeMass = function(massData, density) {
	massData.mass = density * Math.PI * this.m_radiusSquared;
	massData.center.SetV(this.m_p);
	massData.I = massData.mass * (0.5 * this.m_radiusSquared + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.ComputeSubmergedArea = function(normal, offset, xf, c) {
	var p = Box2D.Common.Math.b2Math.MulX(xf, this.m_p);
	var l = (-(Box2D.Common.Math.b2Math.Dot(normal, p) - offset));
	if (l < (-this.m_radius) + Number.MIN_VALUE) {
		return 0;
	}
	if (l > this.m_radius) {
		c.SetV(p);
		return Math.PI * this.m_radiusSquared;
	}
	var l2 = l * l;
	var area = this.m_radiusSquared * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(this.m_radiusSquared - l2);
	var com = (-2 / 3 * Math.pow(this.m_radiusSquared - l2, 1.5) / area);
	c.x = p.x + normal.x * com;
	c.y = p.y + normal.y * com;
	return area;
};

/**
 * @param {!Box2D.Collision.b2DistanceProxy} proxy
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.SetDistanceProxy = function(proxy) {
	proxy.m_vertices = [this.m_p];
	proxy.m_count = 1;
	proxy.m_radius = this.m_radius;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.GetLocalPosition = function() {
	return this.m_p;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} position
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.SetLocalPosition = function(position) {
	this.m_p.SetV(position);
};

/**
 * @return {number}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.GetRadius = function() {
	return this.m_radius;
};

/**
 * @param {number} radius
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.SetRadius = function(radius) {
	this.m_radius = radius;
	this.m_radiusSquared = radius * radius;
};

/**
 * @const
 * @type {string}
 */
Box2D.Collision.Shapes.b2CircleShape.NAME = 'b2CircleShape';

/**
 * @constructor
 */
Box2D.Collision.Shapes.b2EdgeChainDef = function() {
	/** @type {number} */
	this.vertexCount = 0;
	
	/** @type {boolean} */
	this.isALoop = true;
	
	/** @type {Array.<Box2D.Common.Math.b2Vec2} */
	this.vertices = [];
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v1
 * @param {!Box2D.Common.Math.b2Vec2} v2
 * @constructor
 * @extends {Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2EdgeShape = function(v1, v2) {
	Box2D.Collision.Shapes.b2Shape.call(this);
	
	/** @type {Box2D.Collision.Shapes.b2EdgeShape} */
	this.m_prevEdge = null;
	
	/** @type {Box2D.Collision.Shapes.b2EdgeShape} */
	this.m_nextEdge = null;
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_v1 = v1;
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_v2 = v2;
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_direction = Box2D.Common.Math.b2Vec2.Get(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
	
	/** @type {number} */
	this.m_length = this.m_direction.Normalize();
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_normal = Box2D.Common.Math.b2Vec2.Get(this.m_direction.y, -this.m_direction.x);
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_coreV1 = Box2D.Common.Math.b2Vec2.Get((-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x)) + this.m_v1.x, (-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y)) + this.m_v1.y);
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_coreV2 = Box2D.Common.Math.b2Vec2.Get((-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x)) + this.m_v2.x, (-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y)) + this.m_v2.y);
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_cornerDir1 = this.m_normal;
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_cornerDir2 = Box2D.Common.Math.b2Vec2.Get(-this.m_normal.x, -this.m_normal.y);
	
	/** @type {boolean} */
	this.m_cornerConvex1 = false;
	
	/** @type {boolean} */
	this.m_cornerConvex2 = false;
};
c2inherit(Box2D.Collision.Shapes.b2EdgeShape, Box2D.Collision.Shapes.b2Shape);

/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetTypeName = function() {
	return Box2D.Collision.Shapes.b2EdgeShape.NAME;
};

/**
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.TestPoint = function(transform, p) {
	return false;
};

/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.RayCast = function(output, input, transform) {
	var rX = input.p2.x - input.p1.x;
	var rY = input.p2.y - input.p1.y;
	var tMat = transform.R;
	var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
	var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
	var nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y;
	var nY = (-(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X));
	var k_slop = 100.0 * Number.MIN_VALUE;
	var denom = (-(rX * nX + rY * nY));
	if (denom > k_slop) {
		var bX = input.p1.x - v1X;
		var bY = input.p1.y - v1Y;
		var a = (bX * nX + bY * nY);
		if (0.0 <= a && a <= input.maxFraction * denom) {
			var mu2 = (-rX * bY) + rY * bX;
			if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
				a /= denom;
				output.fraction = a;
				var nLen = Math.sqrt(nX * nX + nY * nY);
				output.normal.x = nX / nLen;
				output.normal.y = nY / nLen;
				return true;
			}
		}
	}
	return false;
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} transform
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.ComputeAABB = function(aabb, transform) {
	var tMat = transform.R;
	var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
	var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
	var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
	var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
	if (v1X < v2X) {
		aabb.lowerBound_.x = v1X;
		aabb.upperBound_.x = v2X;
	} else {
		aabb.lowerBound_.x = v2X;
		aabb.upperBound_.x = v1X;
	}
	if (v1Y < v2Y) {
		aabb.lowerBound_.y = v1Y;
		aabb.upperBound_.y = v2Y;
	} else {
		aabb.lowerBound_.y = v2Y;
		aabb.upperBound_.y = v1Y;
	}
};

/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.ComputeMass = function(massData, density) {
	massData.mass = 0;
	massData.center.SetV(this.m_v1);
	massData.I = 0;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.ComputeSubmergedArea = function(normal, offset, xf, c) {
	if (offset === undefined) offset = 0;
	var v0 = Box2D.Common.Math.b2Vec2.Get(normal.x * offset, normal.y * offset);
	var v1 = Box2D.Common.Math.b2Math.MulX(xf, this.m_v1);
	var v2 = Box2D.Common.Math.b2Math.MulX(xf, this.m_v2);
	var d1 = Box2D.Common.Math.b2Math.Dot(normal, v1) - offset;
	var d2 = Box2D.Common.Math.b2Math.Dot(normal, v2) - offset;
	if (d1 > 0) {
		if (d2 > 0) {
			return 0;
		} else {
			v1.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
			v1.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
		}
	} else {
		if (d2 > 0) {
			v2.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
			v2.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
		}
	}
	c.x = (v0.x + v1.x + v2.x) / 3;
	c.y = (v0.y + v1.y + v2.y) / 3;
	return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
};

/**
 * @return {number}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetLength = function() {
	return this.m_length;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetVertex1 = function() {
	return this.m_v1;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetVertex2 = function() {
	return this.m_v2;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCoreVertex1 = function() {
	return this.m_coreV1;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCoreVertex2 = function() {
	return this.m_coreV2;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetNormalVector = function() {
	return this.m_normal;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetDirectionVector = function() {
	return this.m_direction;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCorner1Vector = function() {
	return this.m_cornerDir1;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCorner2Vector = function() {
	return this.m_cornerDir2;
};

/**
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.Corner1IsConvex = function() {
	return this.m_cornerConvex1;
};

/**
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.Corner2IsConvex = function() {
	return this.m_cornerConvex2;
};

/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetFirstVertex = function(xf) {
	var tMat = xf.R;
	return Box2D.Common.Math.b2Vec2.Get(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
};

/**
 * @return {Box2D.Collision.Shapes.b2EdgeShape}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetNextEdge = function() {
	return this.m_nextEdge;
};

/**
 * @return {Box2D.Collision.Shapes.b2EdgeShape}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetPrevEdge = function() {
	return this.m_prevEdge;
};

/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {number} dX
 * @param {number} dY
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.Support = function(xf, dX, dY) {
	var tMat = xf.R;
	var v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
	var v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
	var v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
	var v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
	if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
		return Box2D.Common.Math.b2Vec2.Get(v1X, v1Y);
	} else {
		return Box2D.Common.Math.b2Vec2.Get(v2X, v2Y);
	}
};

/**
 * @param {Box2D.Collision.Shapes.b2EdgeShape} edge
 * @param {!Box2D.Common.Math.b2Vec2} core
 * @param {!Box2D.Common.Math.b2Vec2} cornerDir
 * @param {boolean} convex
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.SetPrevEdge = function(edge, core, cornerDir, convex) {
	this.m_prevEdge = edge;
	this.m_coreV1 = core;
	this.m_cornerDir1 = cornerDir;
	this.m_cornerConvex1 = convex;
};

/**
 * @param {Box2D.Collision.Shapes.b2EdgeShape} edge
 * @param {!Box2D.Common.Math.b2Vec2} core
 * @param {!Box2D.Common.Math.b2Vec2} cornerDir
 * @param {boolean} convex
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.SetNextEdge = function(edge, core, cornerDir, convex) {
	this.m_nextEdge = edge;
	this.m_coreV2 = core;
	this.m_cornerDir2 = cornerDir;
	this.m_cornerConvex2 = convex;
};

/**
 * @const
 * @type {string}
 */
Box2D.Collision.Shapes.b2EdgeShape.NAME = 'b2EdgeShape';

/**
 * @constructor
 */
Box2D.Collision.Shapes.b2MassData = function() {
	/** @type {number} */
	this.mass = 0;
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.center = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {number} */
	this.I = 0;
};

/**
 * @constructor
 * @extends {Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2PolygonShape = function() {
	Box2D.Collision.Shapes.b2Shape.call(this);
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_centroid = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {Array.<!Box2D.Common.Math.b2Vec2>} */
	this.m_vertices = [];
	
	/** @type {Array.<!Box2D.Common.Math.b2Vec2>} */
	this.m_normals = [];
};
c2inherit(Box2D.Collision.Shapes.b2PolygonShape, Box2D.Collision.Shapes.b2Shape);

/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetTypeName = function() {
	return Box2D.Collision.Shapes.b2PolygonShape.NAME;
};

/**
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.Copy = function() {
	var s = new Box2D.Collision.Shapes.b2PolygonShape();
	s.Set(this);
	return s;
};

/**
 * @param {!Box2D.Collision.Shapes.b2Shape} other
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.Set = function(other) {
	Box2D.Collision.Shapes.b2Shape.prototype.Set.call(this, other);
	if (other instanceof Box2D.Collision.Shapes.b2PolygonShape) {
		this.m_centroid.SetV(other.m_centroid);
		this.m_vertexCount = other.m_vertexCount;
		this.Reserve(this.m_vertexCount);
		for (var i = 0; i < this.m_vertexCount; i++) {
			this.m_vertices[i].SetV(other.m_vertices[i]);
			this.m_normals[i].SetV(other.m_normals[i]);
		}
	}
};

/**
 * @param {Array.<Box2D.Common.Math.b2Vec2>} vertices
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsArray = function(vertices) {
	this.SetAsVector(vertices);
};

/**
 * @param {Array.<Box2D.Common.Math.b2Vec2>} vertices
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsArray = function(vertices) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsArray(vertices);
	return polygonShape;
};

/**
 * @param {Array.<!Box2D.Common.Math.b2Vec2>} vertices
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsVector = function(vertices) {
	var vertexCount = vertices.length;
	assert2(2 <= vertexCount);
	this.m_vertexCount = vertexCount;
	this.Reserve(vertexCount);
	var i = 0;
	for (i = 0; i < this.m_vertexCount; i++) {
		this.m_vertices[i].SetV(vertices[i]);
	}
	for (i = 0; i < this.m_vertexCount; ++i) {
		var i1 = i;
		var i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
		var edge = Box2D.Common.Math.b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
		assert2(edge.LengthSquared() > Number.MIN_VALUE);
		this.m_normals[i].SetV(Box2D.Common.Math.b2Math.CrossVF(edge, 1.0));
		this.m_normals[i].Normalize();
	}
	this.m_centroid = Box2D.Collision.Shapes.b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
};

/**
 * @param {Array.<Box2D.Common.Math.b2Vec2>} vertices
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsVector = function(vertices) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsVector(vertices);
	return polygonShape;
};

/**
 * @param {number} hx
 * @param {number} hy
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsBox = function(hx, hy) {
	this.m_vertexCount = 4;
	this.Reserve(4);
	this.m_vertices[0].Set((-hx), (-hy));
	this.m_vertices[1].Set(hx, (-hy));
	this.m_vertices[2].Set(hx, hy);
	this.m_vertices[3].Set((-hx), hy);
	this.m_normals[0].Set(0.0, (-1.0));
	this.m_normals[1].Set(1.0, 0.0);
	this.m_normals[2].Set(0.0, 1.0);
	this.m_normals[3].Set((-1.0), 0.0);
	this.m_centroid.SetZero();
};

/**
 * @param {number} hx
 * @param {number} hy
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsBox = function(hx, hy) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsBox(hx, hy);
	return polygonShape;
};

/**
 * @param {number} hx
 * @param {number} hy
 * @param {!Box2D.Common.Math.b2Vec2} center
 * @param {number} angle
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsOrientedBox = function(hx, hy, center, angle) {
	this.m_vertexCount = 4;
	this.Reserve(4);
	this.m_vertices[0].Set((-hx), (-hy));
	this.m_vertices[1].Set(hx, (-hy));
	this.m_vertices[2].Set(hx, hy);
	this.m_vertices[3].Set((-hx), hy);
	this.m_normals[0].Set(0.0, (-1.0));
	this.m_normals[1].Set(1.0, 0.0);
	this.m_normals[2].Set(0.0, 1.0);
	this.m_normals[3].Set((-1.0), 0.0);
	this.m_centroid = center;
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.Set(angle);
	var xf = new Box2D.Common.Math.b2Transform(center, mat);
	for (var i = 0; i < this.m_vertexCount; ++i) {
		this.m_vertices[i] = Box2D.Common.Math.b2Math.MulX(xf, this.m_vertices[i]);
		this.m_normals[i] = Box2D.Common.Math.b2Math.MulMV(xf.R, this.m_normals[i]);
	}
};

/**
 * @param {number} hx
 * @param {number} hy
 * @param {!Box2D.Common.Math.b2Vec2} center
 * @param {number} angle
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsOrientedBox = function(hx, hy, center, angle) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsOrientedBox(hx, hy, center, angle);
	return polygonShape;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v1
 * @param {!Box2D.Common.Math.b2Vec2} v2
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsEdge = function(v1, v2) {
	this.m_vertexCount = 2;
	this.Reserve(2);
	this.m_vertices[0].SetV(v1);
	this.m_vertices[1].SetV(v2);
	this.m_centroid.x = 0.5 * (v1.x + v2.x);
	this.m_centroid.y = 0.5 * (v1.y + v2.y);
	this.m_normals[0] = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(v2, v1), 1.0);
	this.m_normals[0].Normalize();
	this.m_normals[1].x = (-this.m_normals[0].x);
	this.m_normals[1].y = (-this.m_normals[0].y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} v1
 * @param {!Box2D.Common.Math.b2Vec2} v2
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsEdge = function(v1, v2) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsEdge(v1, v2);
	return polygonShape;
};

/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.TestPoint = function(xf, p) {
	var tVec;
	var tMat = xf.R;
	var tX = p.x - xf.position.x;
	var tY = p.y - xf.position.y;
	var pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y);
	var pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
	for (var i = 0; i < this.m_vertexCount; ++i) {
		tVec = this.m_vertices[i];
		tX = pLocalX - tVec.x;
		tY = pLocalY - tVec.y;
		tVec = this.m_normals[i];
		var dot = (tVec.x * tX + tVec.y * tY);
		if (dot > 0.0) {
			return false;
		}
	}
	return true;
};

/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.RayCast = function(output, input, transform) {
	var lower = 0.0;
	var upper = input.maxFraction;
	var tX = 0;
	var tY = 0;
	var tMat;
	var tVec;
	tX = input.p1.x - transform.position.x;
	tY = input.p1.y - transform.position.y;
	tMat = transform.R;
	var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
	var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
	tX = input.p2.x - transform.position.x;
	tY = input.p2.y - transform.position.y;
	tMat = transform.R;
	var p2X = (tX * tMat.col1.x + tY * tMat.col1.y);
	var p2Y = (tX * tMat.col2.x + tY * tMat.col2.y);
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var index = -1;
	for (var i = 0; i < this.m_vertexCount; ++i) {
		tVec = this.m_vertices[i];
		tX = tVec.x - p1X;
		tY = tVec.y - p1Y;
		tVec = this.m_normals[i];
		var numerator = (tVec.x * tX + tVec.y * tY);
		var denominator = (tVec.x * dX + tVec.y * dY);
		if (denominator == 0.0) {
			if (numerator < 0.0) {
				return false;
			}
		} else {
			if (denominator < 0.0 && numerator < lower * denominator) {
				lower = numerator / denominator;
				index = i;
			} else if (denominator > 0.0 && numerator < upper * denominator) {
				upper = numerator / denominator;
			}
		}
		if (upper < lower - Number.MIN_VALUE) {
			return false;
		}
	}
	if (index >= 0) {
		output.fraction = lower;
		tMat = transform.R;
		tVec = this.m_normals[index];
		output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		return true;
	}
	return false;
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} xf
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.ComputeAABB = function(aabb, xf) {
	var tMat = xf.R;
	var tVec = this.m_vertices[0];
	var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var upperX = lowerX;
	var upperY = lowerY;
	for (var i = 1; i < this.m_vertexCount; ++i) {
		tVec = this.m_vertices[i];
		var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		lowerX = lowerX < vX ? lowerX : vX;
		lowerY = lowerY < vY ? lowerY : vY;
		upperX = upperX > vX ? upperX : vX;
		upperY = upperY > vY ? upperY : vY;
	}
	aabb.lowerBound_.x = lowerX - this.m_radius;
	aabb.lowerBound_.y = lowerY - this.m_radius;
	aabb.upperBound_.x = upperX + this.m_radius;
	aabb.upperBound_.y = upperY + this.m_radius;
};

/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.ComputeMass = function(massData, density) {
	if (this.m_vertexCount == 2) {
		massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
		massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
		massData.mass = 0.0;
		massData.I = 0.0;
		return;
	}
	var centerX = 0.0;
	var centerY = 0.0;
	var area = 0.0;
	var I = 0.0;
	var p1X = 0.0;
	var p1Y = 0.0;
	var k_inv3 = 1.0 / 3.0;
	for (var i = 0; i < this.m_vertexCount; ++i) {
		var p2 = this.m_vertices[i];
		var p3 = i + 1 < this.m_vertexCount ? this.m_vertices[i + 1] : this.m_vertices[0];
		var e1X = p2.x - p1X;
		var e1Y = p2.y - p1Y;
		var e2X = p3.x - p1X;
		var e2Y = p3.y - p1Y;
		var D = e1X * e2Y - e1Y * e2X;
		var triangleArea = 0.5 * D;
		area += triangleArea;
		centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
		centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
		var px = p1X;
		var py = p1Y;
		var ex1 = e1X;
		var ey1 = e1Y;
		var ex2 = e2X;
		var ey2 = e2Y;
		var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
		var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
		I += D * (intx2 + inty2);
	}
	massData.mass = density * area;
	centerX *= 1.0 / area;
	centerY *= 1.0 / area;
	massData.center.Set(centerX, centerY);
	massData.I = density * I;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.ComputeSubmergedArea = function(normal, offset, xf, c) {
	var normalL = Box2D.Common.Math.b2Math.MulTMV(xf.R, normal);
	var offsetL = offset - Box2D.Common.Math.b2Math.Dot(normal, xf.position);
	var depths = [];
	var diveCount = 0;
	var intoIndex = -1;
	var outoIndex = -1;
	var lastSubmerged = false;
	var i = 0;
	for (i = 0; i < this.m_vertexCount; ++i) {
		depths[i] = Box2D.Common.Math.b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
		var isSubmerged = depths[i] < (-Number.MIN_VALUE);
		if (i > 0) {
			if (isSubmerged) {
				if (!lastSubmerged) {
					intoIndex = i - 1;
					diveCount++;
				}
			} else {
				if (lastSubmerged) {
					outoIndex = i - 1;
					diveCount++;
				}
			}
		}
		lastSubmerged = isSubmerged;
	}
	switch (diveCount) {
	case 0:
		if (lastSubmerged) {
			var md = new Box2D.Collision.Shapes.b2MassData();
			this.ComputeMass(md, 1);
			c.SetV(Box2D.Common.Math.b2Math.MulX(xf, md.center));
			return md.mass;
		} else {
			return 0;
		}
		break;
	case 1:
		if (intoIndex == (-1)) {
			intoIndex = this.m_vertexCount - 1;
		} else {
			outoIndex = this.m_vertexCount - 1;
		}
		break;
	}
	var intoIndex2 = ((intoIndex + 1) % this.m_vertexCount);
	var outoIndex2 = ((outoIndex + 1) % this.m_vertexCount);
	var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
	var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
	var intoVec = Box2D.Common.Math.b2Vec2.Get(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
	var outoVec = Box2D.Common.Math.b2Vec2.Get(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
	var area = 0;
	var center = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var p2 = this.m_vertices[intoIndex2];
	var p3;
	i = intoIndex2;
	while (i != outoIndex2) {
		i = (i + 1) % this.m_vertexCount;
		if (i == outoIndex2) p3 = outoVec;
		else p3 = this.m_vertices[i];
		var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
		area += triangleArea;
		center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
		center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
		p2 = p3;
	}
	center.Multiply(1 / area);
	c.SetV(Box2D.Common.Math.b2Math.MulX(xf, center));
	return area;
};

/**
 * @param {!Box2D.Collision.b2DistanceProxy} proxy
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetDistanceProxy = function(proxy) {
	proxy.m_vertices = this.m_vertices;
	proxy.m_count = this.m_vertexCount;
	proxy.m_radius = this.m_radius;
};

/**
 * @return {number}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetVertexCount = function() {
	return this.m_vertexCount;
};

/**
 * @return {Array.<!Box2D.Common.Math.b2Vec2>}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetVertices = function() {
	return this.m_vertices;
};

/**
 * @return {Array.<!Box2D.Common.Math.b2Vec2>}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetNormals = function() {
	return this.m_normals;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} d
 * return {number}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetSupport = function(d) {
	var bestIndex = 0;
	var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
	for (var i = 1; i < this.m_vertexCount; ++i) {
		var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	return bestIndex;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} d
 * return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetSupportVertex = function(d) {
	var bestIndex = 0;
	var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
	for (var i = 1; i < this.m_vertexCount; ++i) {
		var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	return this.m_vertices[bestIndex];
};

/**
 * @param {number} count
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.Reserve = function(count) {
	this.m_vertices = [];
	this.m_normals = [];
	for (var i = this.m_vertices.length; i < count; i++) {
		this.m_vertices[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
		this.m_normals[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};

/**
 * @param {Array.<!Box2D.Common.Math.b2Vec2>} vs
 * @param {number} count
 * return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2PolygonShape.ComputeCentroid = function(vs, count) {
	var c = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var area = 0.0;
	var p1X = 0.0;
	var p1Y = 0.0;
	var inv3 = 1.0 / 3.0;
	for (var i = 0; i < count; ++i) {
		var p2 = vs[i];
		var p3 = i + 1 < count ? vs[i + 1] : vs[0];
		var e1X = p2.x - p1X;
		var e1Y = p2.y - p1Y;
		var e2X = p3.x - p1X;
		var e2Y = p3.y - p1Y;
		var D = (e1X * e2Y - e1Y * e2X);
		var triangleArea = 0.5 * D;
		area += triangleArea;
		c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
		c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
	}
	c.x *= 1.0 / area;
	c.y *= 1.0 / area;
	return c;
};

/** @type {!Box2D.Common.Math.b2Mat22} */
Box2D.Collision.Shapes.b2PolygonShape.s_mat = new Box2D.Common.Math.b2Mat22();

/**
 * @const
 * @type {string}
 */
Box2D.Collision.Shapes.b2PolygonShape.NAME = 'b2PolygonShape';

/**
 * @constructor
 */
Box2D.Collision.b2ContactID = function() {
	
	/** @type {number} */
	this._key = 0;
	
	/** @type {number} */
	this._referenceEdge = 0;
	
	/** @type {number} */
	this._incidentEdge = 0;
	
	/** @type {number} */
	this._incidentVertex = 0;
};

/**
 * @return {number}
 */
Box2D.Collision.b2ContactID.prototype.GetKey = function () {
	return this._key;
};

/**
 * @param {number} key
 */
Box2D.Collision.b2ContactID.prototype.SetKey = function (key) {
	this._key = key;
	this._referenceEdge = this._key & 0x000000ff;
	this._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
	this._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
	this._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
};

/**
 * @param {!Box2D.Collision.b2ContactID} id
 */
Box2D.Collision.b2ContactID.prototype.Set = function (id) {
	this.SetKey(id._key);
};


/**
 * @param {number} edge
 */
Box2D.Collision.b2ContactID.prototype.SetReferenceEdge = function(edge) {
	this._referenceEdge = edge;
	this._key = (this._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
};

/**
 * @param {number} edge
 */
Box2D.Collision.b2ContactID.prototype.SetIncidentEdge = function(edge) {
	this._incidentEdge = edge;
	this._key = (this._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
};

/**
 * @param {number} vertex
 */
Box2D.Collision.b2ContactID.prototype.SetIncidentVertex = function(vertex) {
	this._incidentVertex = vertex;
	this._key = (this._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
};

/**
 * @param {number} flip
 */
Box2D.Collision.b2ContactID.prototype.SetFlip = function(flip) {
	this._flip = flip;
	this._key = (this._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
};

Box2D.Collision.b2ContactID.prototype.Copy = function () {
  var id = new Box2D.Collision.b2ContactID();
  id.Set(this);
  return id;
};

/**
 * @constructor
 */
Box2D.Collision.ClipVertex = function() {
	this.v = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.id = new Box2D.Collision.b2ContactID();
};

Box2D.Collision.ClipVertex.prototype.Set = function(other) {
	this.v.SetV(other.v);
	this.id.Set(other.id);
};

/**
 * @const
 * @type {string}
 */
Box2D.Collision.IBroadPhase = 'Box2D.Collision.IBroadPhase';

/**
 * @private
 * @constructor
 */
Box2D.Collision.b2AABB = function() {
	this.lowerBound_ = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.upperBound_ = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

/**
 * @private
 * @type {Array.<!Box2D.Collision.b2AABB>}
 */
Box2D.Collision.b2AABB._freeCache = [];

/**
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2AABB.Get = function() {
	if (Box2D.Collision.b2AABB._freeCache.length > 0) {
		var aabb = Box2D.Collision.b2AABB._freeCache.pop();
		aabb.SetZero();
		return aabb;
	}
	return new Box2D.Collision.b2AABB();
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Collision.b2AABB.Free = function(aabb) {
	Box2D.Collision.b2AABB._freeCache.push(aabb);
};

Box2D.Collision.b2AABB.prototype.SetZero = function() {
	this.lowerBound_.Set(0, 0);
	this.upperBound_.Set(0, 0);
};

/**
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.IsValid = function() {
	var dX = this.upperBound_.x - this.lowerBound_.x;
	if (dX < 0) {
		return false;
	}
	var dY = this.upperBound_.y - this.lowerBound_.y;
	if (dY < 0) {
		return false;
	}
	return this.lowerBound_.IsValid() && this.upperBound_.IsValid();
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.b2AABB.prototype.GetCenter = function() {
	return Box2D.Common.Math.b2Vec2.Get((this.lowerBound_.x + this.upperBound_.x) / 2, (this.lowerBound_.y + this.upperBound_.y) / 2);
};


/**
 * @param {!Box2D.Common.Math.b2Vec2} newCenter
 */
Box2D.Collision.b2AABB.prototype.SetCenter = function(newCenter) {
	var oldCenter = this.GetCenter();
	this.lowerBound_.Subtract(oldCenter);
	this.upperBound_.Subtract(oldCenter);
	this.lowerBound_.Add(newCenter);
	this.upperBound_.Add(newCenter);
	Box2D.Common.Math.b2Vec2.Free(oldCenter);
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.b2AABB.prototype.GetExtents = function() {
	return Box2D.Common.Math.b2Vec2.Get((this.upperBound_.x - this.lowerBound_.x) / 2, (this.upperBound_.y - this.lowerBound_.y) / 2);
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.Contains = function(aabb) {
	var result = true;
	result = result && this.lowerBound_.x <= aabb.lowerBound_.x;
	result = result && this.lowerBound_.y <= aabb.lowerBound_.y;
	result = result && aabb.upperBound_.x <= this.upperBound_.x;
	result = result && aabb.upperBound_.y <= this.upperBound_.y;
	return result;
};

/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.RayCast = function(output, input) {
	var tmin = (-Number.MAX_VALUE);
	var tmax = Number.MAX_VALUE;
	
	var dX = input.p2.x - input.p1.x;
	var absDX = Math.abs(dX);
	if (absDX < Number.MIN_VALUE) {
		if (input.p1.x < this.lowerBound_.x || this.upperBound_.x < input.p1.x) {
			return false;
		}
	} else {
		var inv_d = 1.0 / dX;
		var t1 = (this.lowerBound_.x - input.p1.x) * inv_d;
		var t2 = (this.upperBound_.x - input.p1.x) * inv_d;
		var s = (-1.0);
		if (t1 > t2) {
			var t3 = t1;
			t1 = t2;
			t2 = t3;
			s = 1.0;
		}
		if (t1 > tmin) {
			output.normal.x = s;
			output.normal.y = 0;
			tmin = t1;
		}
		tmax = Math.min(tmax, t2);
		if (tmin > tmax) return false;
	}
	
	var dY = input.p2.y - input.p1.y;
	var absDY = Math.abs(dY);
	if (absDY < Number.MIN_VALUE) {
		if (input.p1.y < this.lowerBound_.y || this.upperBound_.y < input.p1.y) {
			return false;
		}
	} else {
		var inv_d = 1.0 / dY;
		var t1 = (this.lowerBound_.y - input.p1.y) * inv_d;
		var t2 = (this.upperBound_.y - input.p1.y) * inv_d;
		var s = (-1.0);
		if (t1 > t2) {
			var t3 = t1;
			t1 = t2;
			t2 = t3;
			s = 1.0;
		}
		if (t1 > tmin) {
			output.normal.y = s;
			output.normal.x = 0;
			tmin = t1;
		}
		tmax = Math.min(tmax, t2);
		if (tmin > tmax) {
			return false;
		}
	}
	output.fraction = tmin;
	return true;
};

/**
 * @param {!Box2D.Collision.b2AABB} other
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.TestOverlap = function(other) {
	if ( other.lowerBound_.x - this.upperBound_.x > 0 ) { return false; }
	if ( other.lowerBound_.y - this.upperBound_.y > 0 ) { return false; }
	if ( this.lowerBound_.x - other.upperBound_.x > 0 ) { return false; }
	if ( this.lowerBound_.y - other.upperBound_.y > 0 ) { return false; }
	return true;
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb1
 * @param {!Box2D.Collision.b2AABB} aabb2
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2AABB.Combine = function(aabb1, aabb2) {
	var aabb = Box2D.Collision.b2AABB.Get();
	aabb.Combine(aabb1, aabb2);
	return aabb;
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb1
 * @param {!Box2D.Collision.b2AABB} aabb2
 */
Box2D.Collision.b2AABB.prototype.Combine = function(aabb1, aabb2) {
	this.lowerBound_.x = Math.min(aabb1.lowerBound_.x, aabb2.lowerBound_.x);
	this.lowerBound_.y = Math.min(aabb1.lowerBound_.y, aabb2.lowerBound_.y);
	this.upperBound_.x = Math.max(aabb1.upperBound_.x, aabb2.upperBound_.x);
	this.upperBound_.y = Math.max(aabb1.upperBound_.y, aabb2.upperBound_.y);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} vOut
 * @param {!Box2D.Common.Math.b2Vec2} vIn
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 */
Box2D.Collision.b2Collision.ClipSegmentToLine = function(vOut, vIn, normal, offset) {
	var numOut = 0;
	var vIn0 = vIn[0].v;
	var vIn1 = vIn[1].v;
	var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
	var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
	if (distance0 <= 0.0) {
		vOut[numOut++].Set(vIn[0]);
	}
	if (distance1 <= 0.0) {
		vOut[numOut++].Set(vIn[1]);
	}
	if (distance0 * distance1 < 0.0) {
		var interp = distance0 / (distance0 - distance1);
		var tVec = vOut[numOut].v;
		tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
		tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
		if (distance0 > 0.0) {
			vOut[numOut].id = vIn[0].id;
		} else {
			vOut[numOut].id = vIn[1].id;
		}
		numOut++;
	}
	return numOut;
};

/**
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly1
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @param {number} edge1
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly2
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @return {number}
 */
Box2D.Collision.b2Collision.EdgeSeparation = function(poly1, xf1, edge1, poly2, xf2) {
	var normal1WorldX = (xf1.R.col1.x * poly1.m_normals[edge1].x + xf1.R.col2.x * poly1.m_normals[edge1].y);
	var normal1WorldY = (xf1.R.col1.y * poly1.m_normals[edge1].x + xf1.R.col2.y * poly1.m_normals[edge1].y);
	var normal1X = (xf2.R.col1.x * normal1WorldX + xf2.R.col1.y * normal1WorldY);
	var normal1Y = (xf2.R.col2.x * normal1WorldX + xf2.R.col2.y * normal1WorldY);
	var index = 0;
	var minDot = Number.MAX_VALUE;
	for (var i = 0; i < poly2.m_vertexCount; i++) {
		var dot = poly2.m_vertices[i].x * normal1X + poly2.m_vertices[i].y * normal1Y;
		if (dot < minDot) {
			minDot = dot;
			index = i;
		}
	}
	var v1X = xf1.position.x + (xf1.R.col1.x * poly1.m_vertices[edge1].x + xf1.R.col2.x * poly1.m_vertices[edge1].y);
	var v1Y = xf1.position.y + (xf1.R.col1.y * poly1.m_vertices[edge1].x + xf1.R.col2.y * poly1.m_vertices[edge1].y);
	var v2X = xf2.position.x + (xf2.R.col1.x * poly2.m_vertices[index].x + xf2.R.col2.x * poly2.m_vertices[index].y);
	var v2Y = xf2.position.y + (xf2.R.col1.y * poly2.m_vertices[index].x + xf2.R.col2.y * poly2.m_vertices[index].y);
	var separation = (v2X - v1X) * normal1WorldX + (v2Y - v1Y) * normal1WorldY;
	return separation;
};

/**
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly1
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly2
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @return {{bestEdge: number, separation: number}}
 */
Box2D.Collision.b2Collision.FindMaxSeparation = function(poly1, xf1, poly2, xf2) {
	var dX = xf2.position.x + (xf2.R.col1.x * poly2.m_centroid.x + xf2.R.col2.x * poly2.m_centroid.y);
	var dY = xf2.position.y + (xf2.R.col1.y * poly2.m_centroid.x + xf2.R.col2.y * poly2.m_centroid.y);
	dX -= xf1.position.x + (xf1.R.col1.x * poly1.m_centroid.x + xf1.R.col2.x * poly1.m_centroid.y);
	dY -= xf1.position.y + (xf1.R.col1.y * poly1.m_centroid.x + xf1.R.col2.y * poly1.m_centroid.y);
	var dLocal1X = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
	var dLocal1Y = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
	var edge = 0;
	var maxDot = (-Number.MAX_VALUE);
	for (var i = 0; i < poly1.m_vertexCount; ++i) {
		var dot = (poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y);
		if (dot > maxDot) {
			maxDot = dot;
			edge = i;
		}
	}
	var s = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
	var prevEdge = edge - 1;
	if (prevEdge < 0) {
		prevEdge = poly1.m_vertexCount - 1;
	}
	var sPrev = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
	var nextEdge = edge + 1;
	if (nextEdge >= poly1.m_vertexCount) {
		nextEdge = 0;
	}
	var sNext = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
	var bestEdge = 0;
	var bestSeparation = 0;
	if (sPrev > s && sPrev > sNext) {
		bestEdge = prevEdge;
		bestSeparation = sPrev;
		while (true) {
			edge = bestEdge - 1;
			if (edge < 0) {
				edge = poly1.m_vertexCount - 1;
			}
			s = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
			if (s > bestSeparation) {
				bestEdge = edge;
				bestSeparation = s;
			} else {
				break;
			}
		}
	} else if (sNext > s) {
		bestEdge = nextEdge;
		bestSeparation = sNext;
		while (true) {
			edge = bestEdge + 1;
			if (edge >= poly1.m_vertexCount) {
				edge = 0;
			}
			s = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
			if (s > bestSeparation) {
				bestEdge = edge;
				bestSeparation = s;
			} else {
				break;
			}
		}
	} else {
		bestEdge = edge;
		bestSeparation = s;
	}
	return {bestEdge: bestEdge, separation: bestSeparation};
};

Box2D.Collision.b2Collision.FindIncidentEdge = function(c, poly1, xf1, edge1, poly2, xf2) {
	if (edge1 === undefined) edge1 = 0;
	var normal1X = (xf1.R.col1.x * poly1.m_normals[edge1].x + xf1.R.col2.x * poly1.m_normals[edge1].y);
	var normal1Y = (xf1.R.col1.y * poly1.m_normals[edge1].x + xf1.R.col2.y * poly1.m_normals[edge1].y);
	var tX = (xf2.R.col1.x * normal1X + xf2.R.col1.y * normal1Y);
	normal1Y = (xf2.R.col2.x * normal1X + xf2.R.col2.y * normal1Y);
	normal1X = tX;
	var i1 = 0;
	var minDot = Number.MAX_VALUE;
	for (var i = 0; i < poly2.m_vertexCount; i++) {
		var dot = (normal1X * poly2.m_normals[i].x + normal1Y * poly2.m_normals[i].y);
		if (dot < minDot) {
			minDot = dot;
			i1 = i;
		}
	}
	var i2 = i1 + 1;
	if (i2 >= poly2.m_vertexCount) {
		i2 = 0;
	}
	c[0].v.x = xf2.position.x + (xf2.R.col1.x * poly2.m_vertices[i1].x + xf2.R.col2.x * poly2.m_vertices[i1].y);
	c[0].v.y = xf2.position.y + (xf2.R.col1.y * poly2.m_vertices[i1].x + xf2.R.col2.y * poly2.m_vertices[i1].y);
	c[0].id.SetReferenceEdge(edge1);
	c[0].id.SetIncidentEdge(i1);
	c[0].id.SetIncidentVertex(0);
	c[1].v.x = xf2.position.x + (xf2.R.col1.x * poly2.m_vertices[i2].x + xf2.R.col2.x * poly2.m_vertices[i2].y);
	c[1].v.y = xf2.position.y + (xf2.R.col1.y * poly2.m_vertices[i2].x + xf2.R.col2.y * poly2.m_vertices[i2].y);
	c[1].id.SetReferenceEdge(edge1);
	c[1].id.SetIncidentEdge(i2);
	c[1].id.SetIncidentVertex(1);
};

Box2D.Collision.b2Collision.MakeClipPointVector = function() {
	return [new Box2D.Collision.ClipVertex(), new Box2D.Collision.ClipVertex()];
};

Box2D.Collision.b2Collision.CollidePolygons = function(manifold, polyA, xfA, polyB, xfB) {
	manifold.m_pointCount = 0;
	var totalRadius = polyA.m_radius + polyB.m_radius;
	
	var separationEdgeA = Box2D.Collision.b2Collision.FindMaxSeparation(polyA, xfA, polyB, xfB);
	var edge1 = separationEdgeA.bestEdge;
	if (separationEdgeA.separation > totalRadius) {
		return;
	}
	
	var separationEdgeB = Box2D.Collision.b2Collision.FindMaxSeparation(polyB, xfB, polyA, xfA);
	if (separationEdgeB.separation > totalRadius) {
		return;
	}
	
	var poly1 = polyA;
	var poly2 = polyB;
	var xf1 = xfA;
	var xf2 = xfB;
	var flip = 0;
	manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
	if (separationEdgeB.separation > 0.98 /* k_relativeTol */ * separationEdgeA.separation + 0.001 /* k_absoluteTol */ ) {
		poly1 = polyB;
		poly2 = polyA;
		xf1 = xfB;
		xf2 = xfA;
		edge1 = separationEdgeB.bestEdge;
		manifold.m_type = Box2D.Collision.b2Manifold.e_faceB;
		flip = 1;
	}
	var incidentEdge = Box2D.Collision.b2Collision.s_incidentEdge;
	Box2D.Collision.b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
	var local_v11 = poly1.m_vertices[edge1];
	var local_v12;
	if (edge1 + 1 < poly1.m_vertexCount) {
		local_v12 = poly1.m_vertices[edge1 + 1];
	} else {
		local_v12 = poly1.m_vertices[0];
	}
	Box2D.Collision.b2Collision.s_localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
	Box2D.Collision.b2Collision.s_localTangent.Normalize();
	Box2D.Collision.b2Collision.s_localNormal.x = Box2D.Collision.b2Collision.s_localTangent.y;
	Box2D.Collision.b2Collision.s_localNormal.y = (-Box2D.Collision.b2Collision.s_localTangent.x);
	Box2D.Collision.b2Collision.s_planePoint.Set(0.5 * (local_v11.x + local_v12.x), 0.5 * (local_v11.y + local_v12.y));
	Box2D.Collision.b2Collision.s_tangent.x = (xf1.R.col1.x * Box2D.Collision.b2Collision.s_localTangent.x + xf1.R.col2.x * Box2D.Collision.b2Collision.s_localTangent.y);
	Box2D.Collision.b2Collision.s_tangent.y = (xf1.R.col1.y * Box2D.Collision.b2Collision.s_localTangent.x + xf1.R.col2.y * Box2D.Collision.b2Collision.s_localTangent.y);
	Box2D.Collision.b2Collision.s_tangent2.x = (-Box2D.Collision.b2Collision.s_tangent.x);
	Box2D.Collision.b2Collision.s_tangent2.y = (-Box2D.Collision.b2Collision.s_tangent.y);
	Box2D.Collision.b2Collision.s_normal.x = Box2D.Collision.b2Collision.s_tangent.y;
	Box2D.Collision.b2Collision.s_normal.y = (-Box2D.Collision.b2Collision.s_tangent.x);
	Box2D.Collision.b2Collision.s_v11.x = xf1.position.x + (xf1.R.col1.x * local_v11.x + xf1.R.col2.x * local_v11.y);
	Box2D.Collision.b2Collision.s_v11.y = xf1.position.y + (xf1.R.col1.y * local_v11.x + xf1.R.col2.y * local_v11.y);
	Box2D.Collision.b2Collision.s_v12.x = xf1.position.x + (xf1.R.col1.x * local_v12.x + xf1.R.col2.x * local_v12.y);
	Box2D.Collision.b2Collision.s_v12.y = xf1.position.y + (xf1.R.col1.y * local_v12.x + xf1.R.col2.y * local_v12.y);
	var sideOffset1 = (-Box2D.Collision.b2Collision.s_tangent.x * Box2D.Collision.b2Collision.s_v11.x) - Box2D.Collision.b2Collision.s_tangent.y * Box2D.Collision.b2Collision.s_v11.y + totalRadius;
	if (Box2D.Collision.b2Collision.ClipSegmentToLine(Box2D.Collision.b2Collision.s_clipPoints1, incidentEdge, Box2D.Collision.b2Collision.s_tangent2, sideOffset1) < 2) {
		return;
	}
	var sideOffset2 = Box2D.Collision.b2Collision.s_tangent.x * Box2D.Collision.b2Collision.s_v12.x + Box2D.Collision.b2Collision.s_tangent.y * Box2D.Collision.b2Collision.s_v12.y + totalRadius;
	if (Box2D.Collision.b2Collision.ClipSegmentToLine(Box2D.Collision.b2Collision.s_clipPoints2, Box2D.Collision.b2Collision.s_clipPoints1, Box2D.Collision.b2Collision.s_tangent, sideOffset2) < 2) {
		return;
	}
	manifold.m_localPlaneNormal.SetV(Box2D.Collision.b2Collision.s_localNormal);
	manifold.m_localPoint.SetV(Box2D.Collision.b2Collision.s_planePoint);
	var frontOffset = Box2D.Collision.b2Collision.s_normal.x * Box2D.Collision.b2Collision.s_v11.x + Box2D.Collision.b2Collision.s_normal.y * Box2D.Collision.b2Collision.s_v11.y;
	var pointCount = 0;
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; ++i) {
		var separation = Box2D.Collision.b2Collision.s_normal.x * Box2D.Collision.b2Collision.s_clipPoints2[i].v.x + Box2D.Collision.b2Collision.s_normal.y * Box2D.Collision.b2Collision.s_clipPoints2[i].v.y - frontOffset;
		if (separation <= totalRadius) {
			var tX = Box2D.Collision.b2Collision.s_clipPoints2[i].v.x - xf2.position.x;
			var tY = Box2D.Collision.b2Collision.s_clipPoints2[i].v.y - xf2.position.y;
			manifold.m_points[pointCount].m_localPoint.x = (tX * xf2.R.col1.x + tY * xf2.R.col1.y);
			manifold.m_points[pointCount].m_localPoint.y = (tX * xf2.R.col2.x + tY * xf2.R.col2.y);
			manifold.m_points[pointCount].m_id.Set(Box2D.Collision.b2Collision.s_clipPoints2[i].id);
			manifold.m_points[pointCount].m_id.SetFlip(flip);
			pointCount++;
		}
	}
	manifold.m_pointCount = pointCount;
};

Box2D.Collision.b2Collision.CollideCircles = function(manifold, circle1, xf1, circle2, xf2) {
	manifold.m_pointCount = 0;
	var p1X = xf1.position.x + (xf1.R.col1.x * circle1.m_p.x + xf1.R.col2.x * circle1.m_p.y);
	var p1Y = xf1.position.y + (xf1.R.col1.y * circle1.m_p.x + xf1.R.col2.y * circle1.m_p.y);
	var p2X = xf2.position.x + (xf2.R.col1.x * circle2.m_p.x + xf2.R.col2.x * circle2.m_p.y);
	var p2Y = xf2.position.y + (xf2.R.col1.y * circle2.m_p.x + xf2.R.col2.y * circle2.m_p.y);
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var distSqr = dX * dX + dY * dY;
	var radius = circle1.m_radius + circle2.m_radius;
	if (distSqr > radius * radius) {
		return;
	}
	manifold.m_type = Box2D.Collision.b2Manifold.e_circles;
	manifold.m_localPoint.SetV(circle1.m_p);
	manifold.m_localPlaneNormal.SetZero();
	manifold.m_pointCount = 1;
	manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
	manifold.m_points[0].m_id.SetKey(0);
};

Box2D.Collision.b2Collision.CollidePolygonAndCircle = function(manifold, polygon, xf1, circle, xf2) {
	manifold.m_pointCount = 0;
	var dX = xf2.position.x + (xf2.R.col1.x * circle.m_p.x + xf2.R.col2.x * circle.m_p.y) - xf1.position.x;
	var dY = xf2.position.y + (xf2.R.col1.y * circle.m_p.x + xf2.R.col2.y * circle.m_p.y) - xf1.position.y;
	var cLocalX = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
	var cLocalY = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
	var normalIndex = 0;
	var separation = (-Number.MAX_VALUE);
	var radius = polygon.m_radius + circle.m_radius;
	for (var i = 0; i < polygon.m_vertexCount; ++i) {
		var s = polygon.m_normals[i].x * (cLocalX - polygon.m_vertices[i].x) + polygon.m_normals[i].y * (cLocalY - polygon.m_vertices[i].y);
		if (s > radius) {
			return;
		}
		if (s > separation) {
			separation = s;
			normalIndex = i;
		}
	}
	var vertIndex2 = normalIndex + 1;
	if (vertIndex2 >= polygon.m_vertexCount) {
		vertIndex2 = 0;
	}
	var v1 = polygon.m_vertices[normalIndex];
	var v2 = polygon.m_vertices[vertIndex2];
	if (separation < Number.MIN_VALUE) {
		manifold.m_pointCount = 1;
		manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
		manifold.m_localPlaneNormal.SetV(polygon.m_normals[normalIndex]);
		manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
		manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
		manifold.m_points[0].m_localPoint.SetV(circle.m_p);
		manifold.m_points[0].m_id.SetKey(0);
	} else {
		var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
		if (u1 <= 0.0) {
			if ((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
			manifold.m_pointCount = 1;
			manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
			manifold.m_localPlaneNormal.x = cLocalX - v1.x;
			manifold.m_localPlaneNormal.y = cLocalY - v1.y;
			manifold.m_localPlaneNormal.Normalize();
			manifold.m_localPoint.SetV(v1);
			manifold.m_points[0].m_localPoint.SetV(circle.m_p);
			manifold.m_points[0].m_id.SetKey(0);
		} else {
			var u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
			if (u2 <= 0) {
				if ((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
				manifold.m_pointCount = 1;
				manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
				manifold.m_localPlaneNormal.x = cLocalX - v2.x;
				manifold.m_localPlaneNormal.y = cLocalY - v2.y;
				manifold.m_localPlaneNormal.Normalize();
				manifold.m_localPoint.SetV(v2);
				manifold.m_points[0].m_localPoint.SetV(circle.m_p);
				manifold.m_points[0].m_id.SetKey(0);
			} else {
				var faceCenterX = 0.5 * (v1.x + v2.x);
				var faceCenterY = 0.5 * (v1.y + v2.y);
				separation = (cLocalX - faceCenterX) * polygon.m_normals[normalIndex].x + (cLocalY - faceCenterY) * polygon.m_normals[normalIndex].y;
				if (separation > radius) return;
				manifold.m_pointCount = 1;
				manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
				manifold.m_localPlaneNormal.x = polygon.m_normals[normalIndex].x;
				manifold.m_localPlaneNormal.y = polygon.m_normals[normalIndex].y;
				manifold.m_localPlaneNormal.Normalize();
				manifold.m_localPoint.Set(faceCenterX, faceCenterY);
				manifold.m_points[0].m_localPoint.SetV(circle.m_p);
				manifold.m_points[0].m_id.SetKey(0);
			}
		}
	}
};

Box2D.Collision.b2Collision.TestOverlap = function(a, b) {
	if (b.lowerBound_.x - a.upperBound_.x > 0) {
		return false;
	}
	if (b.lowerBound_.y - a.upperBound_.y > 0) {
		return false;
	}
	if (a.lowerBound_.x - b.upperBound_.x > 0) {
		return false;
	}
	if (a.lowerBound_.y - b.upperBound_.y > 0) {
		return false;
	}
	return true;
};

/**
 * @constructor
 */
Box2D.Collision.b2ContactPoint = function() {
	this.position = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.velocity = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.id = new Box2D.Collision.b2ContactID();
};

/**
 * @param {!Box2D.Collision.b2DistanceOutput} output
 * @param {!Box2D.Collision.b2SimplexCache} cache
 * @param {!Box2D.Collision.b2DistanceInput} input
 */
Box2D.Collision.b2Distance.Distance = function(output, cache, input) {
	var s_simplex = new Box2D.Collision.b2Simplex();
	s_simplex.ReadCache(cache, input.proxyA, input.transformA, input.proxyB, input.transformB);
	if (s_simplex.m_count < 1 || s_simplex.m_count > 3) {
		assert2(false);
	}
	var iter = 0;
	while (iter < 20) {
		var save = [];
		for (var i = 0; i < s_simplex.m_count; i++) {
			save[i] = {};
			save[i].indexA = s_simplex.m_vertices[i].indexA;
			save[i].indexB = s_simplex.m_vertices[i].indexB;
		}
		if (s_simplex.m_count == 2) {
			s_simplex.Solve2();
		} else if (s_simplex.m_count == 3) {
			s_simplex.Solve3();
		}
		if (s_simplex.m_count == 3) {
			// m_count can be changed by s_simplex.Solve3/Solve2
			break;
		}
		var d = s_simplex.GetSearchDirection();
		if (d.LengthSquared() < Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
			break;
		}
		var negD = d.GetNegative();
		s_simplex.m_vertices[s_simplex.m_count].indexA = input.proxyA.GetSupport(Box2D.Common.Math.b2Math.MulTMV(input.transformA.R, negD));
		s_simplex.m_vertices[s_simplex.m_count].wA = Box2D.Common.Math.b2Math.MulX(input.transformA, input.proxyA.GetVertex(s_simplex.m_vertices[s_simplex.m_count].indexA));
		s_simplex.m_vertices[s_simplex.m_count].indexB = input.proxyB.GetSupport(Box2D.Common.Math.b2Math.MulTMV(input.transformB.R, d));
		s_simplex.m_vertices[s_simplex.m_count].wB = Box2D.Common.Math.b2Math.MulX(input.transformB, input.proxyB.GetVertex(s_simplex.m_vertices[s_simplex.m_count].indexB));
		s_simplex.m_vertices[s_simplex.m_count].w = Box2D.Common.Math.b2Math.SubtractVV(s_simplex.m_vertices[s_simplex.m_count].wB, s_simplex.m_vertices[s_simplex.m_count].wA);
		
		Box2D.Common.Math.b2Vec2.Free(d);
		Box2D.Common.Math.b2Vec2.Free(negD);
		
		iter++;
		var duplicate = false;
		for (var i = 0; i < save.length; i++) {
			if (s_simplex.m_vertices[s_simplex.m_count].indexA == save[i].indexA && s_simplex.m_vertices[s_simplex.m_count].indexB == save[i].indexB) {
				duplicate = true;
				break;
			}
		}
		if (duplicate) {
			break;
		}
		s_simplex.m_count++;
	}
	s_simplex.GetWitnessPoints(output.pointA, output.pointB);
	output.distance = Box2D.Common.Math.b2Math.SubtractVV(output.pointA, output.pointB).Length();
	s_simplex.WriteCache(cache);
	if (input.useRadii) {
		var rA = input.proxyA.m_radius;
		var rB = input.proxyB.m_radius;
		if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
			output.distance -= rA + rB;
			var normal = Box2D.Common.Math.b2Math.SubtractVV(output.pointB, output.pointA);
			normal.Normalize();
			output.pointA.x += rA * normal.x;
			output.pointA.y += rA * normal.y;
			output.pointB.x -= rB * normal.x;
			output.pointB.y -= rB * normal.y;
			Box2D.Common.Math.b2Vec2.Free(normal);
		} else {
			var p = Box2D.Common.Math.b2Vec2.Get(0, 0);
			p.x = 0.5 * (output.pointA.x + output.pointB.x);
			p.y = 0.5 * (output.pointA.y + output.pointB.y);
			output.pointA.x = output.pointB.x = p.x;
			output.pointA.y = output.pointB.y = p.y;
			output.distance = 0.0;
			Box2D.Common.Math.b2Vec2.Free(p);
		}
	}
};

/**
 * @constructor
 */
Box2D.Collision.b2DistanceInput = function () {};

/**
 * @constructor
 */
Box2D.Collision.b2DistanceOutput = function () {
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.pointA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.pointB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {number} */
	this.distance = 0;
};

/**
 * @constructor
 */
Box2D.Collision.b2DistanceProxy = function() {};

Box2D.Collision.b2DistanceProxy.prototype.Set = function (shape) {
	shape.SetDistanceProxy(this);
};

Box2D.Collision.b2DistanceProxy.prototype.GetSupport = function (d) {
	var bestIndex = 0;
	var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
	for (var i = 1; i < this.m_count; i++) {
		var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	return bestIndex;
};

Box2D.Collision.b2DistanceProxy.prototype.GetSupportVertex = function (d) {
	return this.m_vertices[this.GetSupport(d)];
};

Box2D.Collision.b2DistanceProxy.prototype.GetVertexCount = function () {
	return this.m_count;
};

Box2D.Collision.b2DistanceProxy.prototype.GetVertex = function (index) {
	if (index === undefined) index = 0;
	assert2(0 <= index && index < this.m_count);
	return this.m_vertices[index];
};

/**
 * @constructor
 */
Box2D.Collision.b2DynamicTree = function() {
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.m_root = null;
	
	/** @type {number} */
	this.m_path = 0;
	
	/** @type {number} */
	this.m_insertionCount = 0;
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {Box2D.Dynamics.b2Fixture} fixture
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTree.prototype.CreateProxy = function(aabb, fixture) {
	var node = Box2D.Collision.b2DynamicTreeNode.Get(fixture);
	var extendX = Box2D.Common.b2Settings.b2_aabbExtension;
	var extendY = Box2D.Common.b2Settings.b2_aabbExtension;
	node.aabb.lowerBound_.x = aabb.lowerBound_.x - extendX;
	node.aabb.lowerBound_.y = aabb.lowerBound_.y - extendY;
	node.aabb.upperBound_.x = aabb.upperBound_.x + extendX;
	node.aabb.upperBound_.y = aabb.upperBound_.y + extendY;
	this.InsertLeaf(node);
	return node;
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 */
Box2D.Collision.b2DynamicTree.prototype.DestroyProxy = function(proxy) {
	this.RemoveLeaf(proxy);
	proxy.Destroy();
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Vec2} displacement
 * @return {boolean}
 */
Box2D.Collision.b2DynamicTree.prototype.MoveProxy = function(proxy, aabb, displacement) {
	assert2(proxy.IsLeaf());
	if (proxy.aabb.Contains(aabb)) {
		return false;
	}
	this.RemoveLeaf(proxy);
	var extendX = Box2D.Common.b2Settings.b2_aabbExtension + Box2D.Common.b2Settings.b2_aabbMultiplier * Math.abs(displacement.x);
	var extendY = Box2D.Common.b2Settings.b2_aabbExtension + Box2D.Common.b2Settings.b2_aabbMultiplier * Math.abs(displacement.y);
	proxy.aabb.lowerBound_.x = aabb.lowerBound_.x - extendX;
	proxy.aabb.lowerBound_.y = aabb.lowerBound_.y - extendY;
	proxy.aabb.upperBound_.x = aabb.upperBound_.x + extendX;
	proxy.aabb.upperBound_.y = aabb.upperBound_.y + extendY;
	this.InsertLeaf(proxy);
	return true;
};

/**
 * @param {number} iterations
 */
Box2D.Collision.b2DynamicTree.prototype.Rebalance = function(iterations) {
	if (this.m_root !== null) {
		for (var i = 0; i < iterations; i++) {
			var node = this.m_root;
			var bit = 0;
			while (!node.IsLeaf()) {
				node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
				bit = (bit + 1) & 31;
			}
			this.m_path++;
			this.RemoveLeaf(node);
			this.InsertLeaf(node);
		}
	}
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2DynamicTree.prototype.GetFatAABB = function(proxy) {
	return proxy.aabb;
};

/**
 * @param {function(!Box2D.Dynamics.b2Fixture): boolean} callback
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Collision.b2DynamicTree.prototype.Query = function(callback, aabb) {
	if (this.m_root !== null) {
		var stack = [];
		stack.push(this.m_root);
		while (stack.length > 0) {
			var node = stack.pop();
			if (node.aabb.TestOverlap(aabb)) {
				if (node.IsLeaf()) {
					if (!callback(node.fixture)) {
						return;
					}
				} else {
					stack.push(node.child1);
					stack.push(node.child2);
				}
			}
		}
	}
};

/**
 * @param {function(!Box2D.Collision.b2RayCastInput, !Box2D.Dynamics.b2Fixture): number} callback
 * @param {!Box2D.Collision.b2RayCastInput} input
 */
Box2D.Collision.b2DynamicTree.prototype.RayCast = function(callback, input) {
	if (this.m_root === null) {
		return;
	}
	
	var r = Box2D.Common.Math.b2Math.SubtractVV(input.p1, input.p2);
	r.Normalize();
	var v = Box2D.Common.Math.b2Math.CrossFV(1.0, r);
	var abs_v = Box2D.Common.Math.b2Math.AbsV(v);
	var maxFraction = input.maxFraction;
	var tX = input.p1.x + maxFraction * (input.p2.x - input.p1.x);
	var tY = input.p1.y + maxFraction * (input.p2.y - input.p1.y);
	
	var segmentAABB = Box2D.Collision.b2AABB.Get();
	segmentAABB.lowerBound_.x = Math.min(input.p1.x, tX);
	segmentAABB.lowerBound_.y = Math.min(input.p1.y, tY);
	segmentAABB.upperBound_.x = Math.max(input.p1.x, tX);
	segmentAABB.upperBound_.y = Math.max(input.p1.y, tY);
	
	var stack = [];
	stack.push(this.m_root);
	while (stack.length > 0) {
		var node = stack.pop();
		if (!node.aabb.TestOverlap(segmentAABB)) {
			continue;
		}
		var c = node.aabb.GetCenter();
		var h = node.aabb.GetExtents();
		var separation = Math.abs(v.x * (input.p1.x - c.x) + v.y * (input.p1.y - c.y)) - abs_v.x * h.x - abs_v.y * h.y;
		if (separation > 0.0) {
			continue;
		}
		if (node.IsLeaf()) {
			var subInput = new Box2D.Collision.b2RayCastInput(input.p1, input.p2, input.maxFraction);
			maxFraction = callback(input, node.fixture);
			if (maxFraction == 0.0) {
				break;
			}
			if (maxFraction > 0.0) {
				tX = input.p1.x + maxFraction * (input.p2.x - input.p1.x);
				tY = input.p1.y + maxFraction * (input.p2.y - input.p1.y);
				segmentAABB.lowerBound_.x = Math.min(input.p1.x, tX);
				segmentAABB.lowerBound_.y = Math.min(input.p1.y, tY);
				segmentAABB.upperBound_.x = Math.max(input.p1.x, tX);
				segmentAABB.upperBound_.y = Math.max(input.p1.y, tY);
			}
		} else {
			stack.push(node.child1);
			stack.push(node.child2);
		}
	}
	Box2D.Collision.b2AABB.Free(segmentAABB);
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} leaf
 */
Box2D.Collision.b2DynamicTree.prototype.InsertLeaf = function(leaf) {
	this.m_insertionCount++;
	if (this.m_root === null) {
		this.m_root = leaf;
		this.m_root.parent = null;
		return;
	}
	var sibling = this.GetBestSibling(leaf);
	
	var parent = sibling.parent;
	var node2 = Box2D.Collision.b2DynamicTreeNode.Get();
	node2.parent = parent;
	node2.aabb.Combine(leaf.aabb, sibling.aabb);
	if (parent) {
		if (sibling.parent.child1 == sibling) {
			parent.child1 = node2;
		} else {
			parent.child2 = node2;
		}
		node2.child1 = sibling;
		node2.child2 = leaf;
		sibling.parent = node2;
		leaf.parent = node2;
		while (parent) {
			if (parent.aabb.Contains(node2.aabb)) {
				break;
			}
			parent.aabb.Combine(parent.child1.aabb, parent.child2.aabb);
			node2 = parent;
			parent = parent.parent;
		}
	} else {
		node2.child1 = sibling;
		node2.child2 = leaf;
		sibling.parent = node2;
		leaf.parent = node2;
		this.m_root = node2;
	}
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} leaf
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTree.prototype.GetBestSibling = function(leaf) {
	var center = leaf.aabb.GetCenter();
	var sibling = this.m_root;
	while(!sibling.IsLeaf()) {
		var child1 = sibling.child1;
		var child2 = sibling.child2;
		var norm1 = Math.abs((child1.aabb.lowerBound_.x + child1.aabb.upperBound_.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound_.y + child1.aabb.upperBound_.y) / 2 - center.y);
		var norm2 = Math.abs((child2.aabb.lowerBound_.x + child2.aabb.upperBound_.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound_.y + child2.aabb.upperBound_.y) / 2 - center.y);
		if (norm1 < norm2) {
			sibling = child1; 
		} else {
			sibling = child2;
		}
	}
	Box2D.Common.Math.b2Vec2.Free(center);
	return sibling;
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} leaf
 */
Box2D.Collision.b2DynamicTree.prototype.RemoveLeaf = function(leaf) {
	if (leaf == this.m_root) {
		this.m_root = null;
		return;
	}
	var node2 = leaf.parent;
	var node1 = node2.parent;
	var sibling;
	if (node2.child1 == leaf) {
		sibling = node2.child2;
	} else {
		sibling = node2.child1;
	}
	if (node1) {
		if (node1.child1 == node2) {
			node1.child1 = sibling;
		} else {
			node1.child2 = sibling;
		}
		sibling.parent = node1;
		while (node1) {
			var oldAABB = node1.aabb;
			node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
			if (oldAABB.Contains(node1.aabb)) {
				break;
			}
			node1 = node1.parent;
		}
	} else {
		this.m_root = sibling;
		sibling.parent = null;
	}
	node2.Destroy();
};

/**
 * @constructor
 */
Box2D.Collision.b2DynamicTreeBroadPhase = function() {
	
	/**
	 * @private
	 * @type {!Box2D.Collision.b2DynamicTree}
	 */
	this.m_tree = new Box2D.Collision.b2DynamicTree();
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Collision.b2DynamicTreeNode>}
	 */
	this.m_moveBuffer = [];
};

/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {Box2D.Dynamics.b2Fixture} fixture
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.CreateProxy = function(aabb, fixture) {
	var proxy = this.m_tree.CreateProxy(aabb, fixture);
	this.BufferMove(proxy);
	return proxy;
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.DestroyProxy = function(proxy) {
	this.UnBufferMove(proxy);
	this.m_tree.DestroyProxy(proxy);
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Vec2} displacement
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.MoveProxy = function(proxy, aabb, displacement) {
	var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
	if (buffer) {
		this.BufferMove(proxy);
	}
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxyA
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxyB
 * @return {boolean}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.TestOverlap = function(proxyA, proxyB) {
	var aabbA = this.m_tree.GetFatAABB(proxyA);
	var aabbB = this.m_tree.GetFatAABB(proxyB);
	return aabbA.TestOverlap(aabbB);
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.GetFatAABB = function(proxy) {
	return this.m_tree.GetFatAABB(proxy);
};

/**
 * @return {number}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.GetProxyCount = function() {
	return this.m_tree.length;
};

/**
 * @param {function(!Box2D.Dynamics.b2Fixture, !Box2D.Dynamics.b2Fixture)} callback
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.UpdatePairs = function(callback) {
	var __this = this;
	var pairs = [];
	while (this.m_moveBuffer.length > 0) {
		var queryProxy = this.m_moveBuffer.pop();
		
		var QueryCallback = function(fixture) {
			if (fixture != queryProxy.fixture) {
				pairs.push(new Box2D.Collision.b2DynamicTreePair(queryProxy.fixture, fixture));
			}
			return true;
		};
		var fatAABB = this.m_tree.GetFatAABB(queryProxy);
		this.m_tree.Query(QueryCallback, fatAABB);
	}
	var i = 0;
	while(i < pairs.length) {
		var primaryPair = pairs[i];
		callback(primaryPair.fixtureA, primaryPair.fixtureB);
		i++;
		while(i < pairs.length) {
			var pair = pairs[i];
			if (!(pair.fixtureA == primaryPair.fixtureA && pair.fixtureB == primaryPair.fixtureB)
				&& !(pair.fixtureA == primaryPair.fixtureB && pair.fixtureB == primaryPair.fixtureA)) {
				break;
			}
			i++;
		}
	}
};

/**
 * @param {function(!Box2D.Dynamics.b2Fixture): boolean} callback
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.Query = function(callback, aabb) {
	this.m_tree.Query(callback, aabb);
};

/**
 * @param {function(!Box2D.Collision.b2RayCastInput, !Box2D.Dynamics.b2Fixture): number} callback
 * @param {!Box2D.Collision.b2RayCastInput} input
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.RayCast = function(callback, input) {
	this.m_tree.RayCast(callback, input);
};

/**
 * @param {number} iterations
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.Rebalance = function(iterations) {
	this.m_tree.Rebalance(iterations);
};

Box2D.Collision.b2DynamicTreeBroadPhase.prototype.BufferMove = function(proxy) {
	this.m_moveBuffer.push(proxy);
};

Box2D.Collision.b2DynamicTreeBroadPhase.prototype.UnBufferMove = function(proxy) {
	cr.arrayFindRemove(this.m_moveBuffer, proxy);
};

Box2D.Collision.b2DynamicTreeBroadPhase.__implements = {};
Box2D.Collision.b2DynamicTreeBroadPhase.__implements[Box2D.Collision.IBroadPhase] = true;

/**
 * @private
 * @param {Box2D.Dynamics.b2Fixture=} fixture
 * @constructor
 */
Box2D.Collision.b2DynamicTreeNode = function(fixture) {
	/** @type {!Box2D.Collision.b2AABB} */
	this.aabb = Box2D.Collision.b2AABB.Get();
	
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.child1 = null;
	
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.child2 = null;
	
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.parent = null;
	
	/** @type {Box2D.Dynamics.b2Fixture} */
	this.fixture = null;
	
	if (typeof(fixture) != "undefined") {
		this.fixture = fixture;
	}
};

/**
 * @private
 * @type {Array.<!Box2D.Collision.b2DynamicTreeNode>}
 */
Box2D.Collision.b2DynamicTreeNode._freeCache = [];

/**
 * @param {Box2D.Dynamics.b2Fixture=} fixture
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTreeNode.Get = function(fixture) {
	if (Box2D.Collision.b2DynamicTreeNode._freeCache.length > 0) {
		var node = Box2D.Collision.b2DynamicTreeNode._freeCache.pop();
		if (typeof(fixture) != "undefined") {
			node.fixture = fixture;
		}
		node.aabb.SetZero();
		return node;
	}
	return new Box2D.Collision.b2DynamicTreeNode(fixture);
};

Box2D.Collision.b2DynamicTreeNode.prototype.Destroy = function() {
	this.child1 = null;
	this.child2 = null;
	this.parent = null;
	this.fixture = null;
	Box2D.Collision.b2DynamicTreeNode._freeCache.push(this);
};

/**
 * @return boolean
 */
Box2D.Collision.b2DynamicTreeNode.prototype.IsLeaf = function () {
	return this.child1 === null;
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 */
Box2D.Collision.b2DynamicTreePair = function(fixtureA, fixtureB) {
	/** @type {!Box2D.Dynamics.b2Fixture} */
	this.fixtureA = fixtureA;
	
	/** @type {!Box2D.Dynamics.b2Fixture} */
	this.fixtureB = fixtureB;
};

/**
 * @constructor
 */
Box2D.Collision.b2Manifold = function() {
	this.m_pointCount = 0;
	this.m_type = 0;
	this.m_points = [];
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i] = new Box2D.Collision.b2ManifoldPoint();
	}
	this.m_localPlaneNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Collision.b2Manifold.prototype.Reset = function() {
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i].Reset();
	}
	this.m_localPlaneNormal.SetZero();
	this.m_localPoint.SetZero();
	this.m_type = 0;
	this.m_pointCount = 0;
};

Box2D.Collision.b2Manifold.prototype.Set = function(m) {
	this.m_pointCount = m.m_pointCount;
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i].Set(m.m_points[i]);
	}
	this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
	this.m_localPoint.SetV(m.m_localPoint);
	this.m_type = m.m_type;
};

Box2D.Collision.b2Manifold.prototype.Copy = function() {
	var copy = new Box2D.Collision.b2Manifold();
	copy.Set(this);
	return copy;
};

Box2D.Collision.b2Manifold.e_circles = 0x0001;
Box2D.Collision.b2Manifold.e_faceA = 0x0002;
Box2D.Collision.b2Manifold.e_faceB = 0x0004;

/**
 * @constructor
 */
Box2D.Collision.b2ManifoldPoint = function() {
	this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_id = new Box2D.Collision.b2ContactID();
	this.Reset();
};

Box2D.Collision.b2ManifoldPoint.prototype.Reset = function() {
	this.m_localPoint.SetZero();
	this.m_normalImpulse = 0.0;
	this.m_tangentImpulse = 0.0;
	this.m_id.SetKey(0);
};

Box2D.Collision.b2ManifoldPoint.prototype.Set = function(m) {
	this.m_localPoint.SetV(m.m_localPoint);
	this.m_normalImpulse = m.m_normalImpulse;
	this.m_tangentImpulse = m.m_tangentImpulse;
	this.m_id.Set(m.m_id);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} p1
 * @param {!Box2D.Common.Math.b2Vec2} p2
 * @param {number} maxFraction
 * @constructor
 */
Box2D.Collision.b2RayCastInput = function(p1, p2, maxFraction) {
	  this.p1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  this.p2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  if (maxFraction === undefined) maxFraction = 1;
	  if (p1) this.p1.SetV(p1);
	  if (p2) this.p2.SetV(p2);
	  this.maxFraction = maxFraction;
};

/**
 * @constructor
 */
Box2D.Collision.b2RayCastOutput = function() {
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

/**
 * @constructor
 */
Box2D.Collision.b2Segment = function() {
	this.p1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.p2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Collision.b2Segment.prototype.TestSegment = function(lambda, normal, segment, maxLambda) {
	if (maxLambda === undefined) maxLambda = 0;
	var s = segment.p1;
	var rX = segment.p2.x - s.x;
	var rY = segment.p2.y - s.y;
	var dX = this.p2.x - this.p1.x;
	var dY = this.p2.y - this.p1.y;
	var nX = dY;
	var nY = (-dX);
	var k_slop = 100.0 * Number.MIN_VALUE;
	var denom = (-(rX * nX + rY * nY));
	if (denom > k_slop) {
		var bX = s.x - this.p1.x;
		var bY = s.y - this.p1.y;
		var a = (bX * nX + bY * nY);
		if (0.0 <= a && a <= maxLambda * denom) {
			var mu2 = (-rX * bY) + rY * bX;
			if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
				a /= denom;
				var nLen = Math.sqrt(nX * nX + nY * nY);
				nX /= nLen;
				nY /= nLen;
				lambda[0] = a;
				normal.Set(nX, nY);
				return true;
			}
		}
	}
	return false;
};

Box2D.Collision.b2Segment.prototype.Extend = function(aabb) {
	this.ExtendForward(aabb);
	this.ExtendBackward(aabb);
};

Box2D.Collision.b2Segment.prototype.ExtendForward = function(aabb) {
	var dX = this.p2.x - this.p1.x;
	var dY = this.p2.y - this.p1.y;
	var lambda = Math.min(dX > 0 ? (aabb.upperBound_.x - this.p1.x) / dX : dX < 0 ? (aabb.lowerBound_.x - this.p1.x) / dX : Number.POSITIVE_INFINITY, dY > 0 ? (aabb.upperBound_.y - this.p1.y) / dY : dY < 0 ? (aabb.lowerBound_.y - this.p1.y) / dY : Number.POSITIVE_INFINITY);
	this.p2.x = this.p1.x + dX * lambda;
	this.p2.y = this.p1.y + dY * lambda;
};

Box2D.Collision.b2Segment.prototype.ExtendBackward = function(aabb) {
	var dX = (-this.p2.x) + this.p1.x;
	var dY = (-this.p2.y) + this.p1.y;
	var lambda = Math.min(dX > 0 ? (aabb.upperBound_.x - this.p2.x) / dX : dX < 0 ? (aabb.lowerBound_.x - this.p2.x) / dX : Number.POSITIVE_INFINITY, dY > 0 ? (aabb.upperBound_.y - this.p2.y) / dY : dY < 0 ? (aabb.lowerBound_.y - this.p2.y) / dY : Number.POSITIVE_INFINITY);
	this.p1.x = this.p2.x + dX * lambda;
	this.p1.y = this.p2.y + dY * lambda;
};

/**
 * @constructor
 */
Box2D.Collision.b2SeparationFunction = function() {
	this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_axis = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Collision.b2SeparationFunction.prototype.Initialize = function(cache, proxyA, transformA, proxyB, transformB) {
	this.m_proxyA = proxyA;
	this.m_proxyB = proxyB;
	var count = cache.count;
	assert2(0 < count && count < 3);
	var localPointA;
	var localPointA1;
	var localPointA2;
	var localPointB;
	var localPointB1;
	var localPointB2;
	var pointAX = 0;
	var pointAY = 0;
	var pointBX = 0;
	var pointBY = 0;
	var normalX = 0;
	var normalY = 0;
	var tMat;
	var tVec;
	var s = 0;
	var sgn = 0;
	if (count == 1) {
		this.m_type = Box2D.Collision.b2SeparationFunction.e_points;
		localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
		localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
		tVec = localPointA;
		tMat = transformA.R;
		pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		tVec = localPointB;
		tMat = transformB.R;
		pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		this.m_axis.x = pointBX - pointAX;
		this.m_axis.y = pointBY - pointAY;
		this.m_axis.Normalize();
	} else if (cache.indexB[0] == cache.indexB[1]) {
		this.m_type = Box2D.Collision.b2SeparationFunction.e_faceA;
		localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
		localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
		localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
		this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
		this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
		this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
		this.m_axis.Normalize();
		tVec = this.m_axis;
		tMat = transformA.R;
		normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tVec = this.m_localPoint;
		tMat = transformA.R;
		pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		tVec = localPointB;
		tMat = transformB.R;
		pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
		if (s < 0.0) {
			this.m_axis.NegativeSelf();
		}
	} else if (cache.indexA[0] == cache.indexA[0]) {
		this.m_type = Box2D.Collision.b2SeparationFunction.e_faceB;
		localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
		localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
		localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
		this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
		this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
		this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
		this.m_axis.Normalize();
		tVec = this.m_axis;
		tMat = transformB.R;
		normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tVec = this.m_localPoint;
		tMat = transformB.R;
		pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		tVec = localPointA;
		tMat = transformA.R;
		pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
		if (s < 0.0) {
			this.m_axis.NegativeSelf();
		}
	} else {
		localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
		localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
		localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
		localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
		var dA = Box2D.Common.Math.b2Math.MulMV(transformA.R, Box2D.Common.Math.b2Math.SubtractVV(localPointA2, localPointA1));
		var dB = Box2D.Common.Math.b2Math.MulMV(transformB.R, Box2D.Common.Math.b2Math.SubtractVV(localPointB2, localPointB1));
		var a = dA.x * dA.x + dA.y * dA.y;
		var e = dB.x * dB.x + dB.y * dB.y;
		var r = Box2D.Common.Math.b2Math.SubtractVV(dB, dA);
		var c = dA.x * r.x + dA.y * r.y;
		var f = dB.x * r.x + dB.y * r.y;
		var b = dA.x * dB.x + dA.y * dB.y;
		var denom = a * e - b * b;
		s = 0.0;
		if (denom != 0.0) {
			s = Box2D.Common.Math.b2Math.Clamp((b * f - c * e) / denom, 0.0, 1.0);
		}
		var t = (b * s + f) / e;
		if (t < 0.0) {
			t = 0.0;
			s = Box2D.Common.Math.b2Math.Clamp((b - c) / a, 0.0, 1.0);
		}
		localPointA = Box2D.Common.Math.b2Vec2.Get(0, 0);
		localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
		localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
		localPointB = Box2D.Common.Math.b2Vec2.Get(0, 0);
		localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
		localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
		if (s == 0.0 || s == 1.0) {
			this.m_type = Box2D.Collision.b2SeparationFunction.e_faceB;
			this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
			this.m_axis.Normalize();
			this.m_localPoint = localPointB;
			tVec = this.m_axis;
			tMat = transformB.R;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tVec = this.m_localPoint;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointA;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
			if (s < 0.0) {
				this.m_axis.NegativeSelf();
			}
		} else {
			this.m_type = Box2D.Collision.b2SeparationFunction.e_faceA;
			this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
			this.m_localPoint = localPointA;
			tVec = this.m_axis;
			tMat = transformA.R;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tVec = this.m_localPoint;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointB;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
			if (s < 0.0) {
				this.m_axis.NegativeSelf();
			}
		}
	}
};

Box2D.Collision.b2SeparationFunction.prototype.Evaluate = function(transformA, transformB) {
	var axisA;
	var axisB;
	var localPointA;
	var localPointB;
	var pointA;
	var pointB;
	var seperation = 0;
	var normal;
	switch (this.m_type) {
	case Box2D.Collision.b2SeparationFunction.e_points:
		axisA = Box2D.Common.Math.b2Math.MulTMV(transformA.R, this.m_axis);
		axisB = Box2D.Common.Math.b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
		localPointA = this.m_proxyA.GetSupportVertex(axisA);
		localPointB = this.m_proxyB.GetSupportVertex(axisB);
		pointA = Box2D.Common.Math.b2Math.MulX(transformA, localPointA);
		pointB = Box2D.Common.Math.b2Math.MulX(transformB, localPointB);
		seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
		break;
	case Box2D.Collision.b2SeparationFunction.e_faceA:
		normal = Box2D.Common.Math.b2Math.MulMV(transformA.R, this.m_axis);
		pointA = Box2D.Common.Math.b2Math.MulX(transformA, this.m_localPoint);
		axisB = Box2D.Common.Math.b2Math.MulTMV(transformB.R, normal.GetNegative());
		localPointB = this.m_proxyB.GetSupportVertex(axisB);
		pointB = Box2D.Common.Math.b2Math.MulX(transformB, localPointB);
		seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
		break;
	case Box2D.Collision.b2SeparationFunction.e_faceB:
		normal = Box2D.Common.Math.b2Math.MulMV(transformB.R, this.m_axis);
		pointB = Box2D.Common.Math.b2Math.MulX(transformB, this.m_localPoint);
		axisA = Box2D.Common.Math.b2Math.MulTMV(transformA.R, normal.GetNegative());
		localPointA = this.m_proxyA.GetSupportVertex(axisA);
		pointA = Box2D.Common.Math.b2Math.MulX(transformA, localPointA);
		seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
		break;
	default:
		assert2(false);
		break;
	}
	return seperation;
};

Box2D.Collision.b2SeparationFunction.e_points = 0x01;
Box2D.Collision.b2SeparationFunction.e_faceA = 0x02;
Box2D.Collision.b2SeparationFunction.e_faceB = 0x04;

/**
 * @constructor
 */
Box2D.Collision.b2Simplex = function() {
	this.m_v1 = new Box2D.Collision.b2SimplexVertex();
	this.m_v2 = new Box2D.Collision.b2SimplexVertex();
	this.m_v3 = new Box2D.Collision.b2SimplexVertex();
	this.m_vertices = [this.m_v1, this.m_v2, this.m_v3];
};

Box2D.Collision.b2Simplex.prototype.ReadCache = function(cache, proxyA, transformA, proxyB, transformB) {
	assert2(0 <= cache.count && cache.count <= 3);
	var wALocal;
	var wBLocal;
	this.m_count = cache.count;
	var vertices = this.m_vertices;
	for (var i = 0; i < this.m_count; i++) {
		var v = vertices[i];
		v.indexA = cache.indexA[i];
		v.indexB = cache.indexB[i];
		wALocal = proxyA.GetVertex(v.indexA);
		wBLocal = proxyB.GetVertex(v.indexB);
		v.wA = Box2D.Common.Math.b2Math.MulX(transformA, wALocal);
		v.wB = Box2D.Common.Math.b2Math.MulX(transformB, wBLocal);
		v.w = Box2D.Common.Math.b2Math.SubtractVV(v.wB, v.wA);
		v.a = 0;
	}
	if (this.m_count > 1) {
		var metric1 = cache.metric;
		var metric2 = this.GetMetric();
		if (metric2 < .5 * metric1 || 2.0 * metric1 < metric2 || metric2 < Number.MIN_VALUE) {
			this.m_count = 0;
		}
	}
	if (this.m_count == 0) {
		v = vertices[0];
		v.indexA = 0;
		v.indexB = 0;
		wALocal = proxyA.GetVertex(0);
		wBLocal = proxyB.GetVertex(0);
		v.wA = Box2D.Common.Math.b2Math.MulX(transformA, wALocal);
		v.wB = Box2D.Common.Math.b2Math.MulX(transformB, wBLocal);
		v.w = Box2D.Common.Math.b2Math.SubtractVV(v.wB, v.wA);
		this.m_count = 1;
	}
};

Box2D.Collision.b2Simplex.prototype.WriteCache = function(cache) {
	cache.metric = this.GetMetric();
	cache.count = this.m_count;
	var vertices = this.m_vertices;
	for (var i = 0; i < this.m_count; i++) {
		cache.indexA[i] = vertices[i].indexA;
		cache.indexB[i] = vertices[i].indexB;
	}
};

Box2D.Collision.b2Simplex.prototype.GetSearchDirection = function() {
	if (this.m_count == 1) {
		return this.m_v1.w.GetNegative();
	} else if (this.m_count == 2) {
			var e12 = Box2D.Common.Math.b2Math.SubtractVV(this.m_v2.w, this.m_v1.w);
			var sgn = Box2D.Common.Math.b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
			if (sgn > 0.0) {
				return Box2D.Common.Math.b2Math.CrossFV(1.0, e12);
			}
			else {
				return Box2D.Common.Math.b2Math.CrossVF(e12, 1.0);
			}
	} else {
		assert2(false);
		return Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};

Box2D.Collision.b2Simplex.prototype.GetClosestPoint = function() {
	if (this.m_count == 1) {
		return this.m_v1.w;
	} else if (this.m_count == 2) {
		return Box2D.Common.Math.b2Vec2.Get(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
	} else {
		assert2(false);
		return Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};

Box2D.Collision.b2Simplex.prototype.GetWitnessPoints = function(pA, pB) {
	if (this.m_count == 1) {
		pA.SetV(this.m_v1.wA);
		pB.SetV(this.m_v1.wB);
	} else if (this.m_count == 2) {
		pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
		pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
		pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
		pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
	} else if (this.m_count == 3) {
		pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
		pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
	} else {
		assert2(false);
	}
};

Box2D.Collision.b2Simplex.prototype.GetMetric = function() {
	if (this.m_count == 1) {
		return 0.0;
	} else if (this.m_count == 2) {
		return Box2D.Common.Math.b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
	} else if (this.m_count == 3) {
		return Box2D.Common.Math.b2Math.CrossVV(Box2D.Common.Math.b2Math.SubtractVV(this.m_v2.w, this.m_v1.w), Box2D.Common.Math.b2Math.SubtractVV(this.m_v3.w, this.m_v1.w));
	} else {
		assert2(false);
		return 0.0;
	}
};

Box2D.Collision.b2Simplex.prototype.Solve2 = function() {
	var w1 = this.m_v1.w;
	var w2 = this.m_v2.w;
	var e12 = Box2D.Common.Math.b2Math.SubtractVV(w2, w1);
	var d12_2 = (-(w1.x * e12.x + w1.y * e12.y));
	if (d12_2 <= 0.0) {
		this.m_v1.a = 1.0;
		this.m_count = 1;
		return;
	}
	var d12_1 = (w2.x * e12.x + w2.y * e12.y);
	if (d12_1 <= 0.0) {
		this.m_v2.a = 1.0;
		this.m_count = 1;
		this.m_v1.Set(this.m_v2);
		return;
	}
	var inv_d12 = 1.0 / (d12_1 + d12_2);
	this.m_v1.a = d12_1 * inv_d12;
	this.m_v2.a = d12_2 * inv_d12;
	this.m_count = 2;
};

Box2D.Collision.b2Simplex.prototype.Solve3 = function() {
	var w1 = this.m_v1.w;
	var w2 = this.m_v2.w;
	var w3 = this.m_v3.w;
	var e12 = Box2D.Common.Math.b2Math.SubtractVV(w2, w1);
	var w1e12 = Box2D.Common.Math.b2Math.Dot(w1, e12);
	var w2e12 = Box2D.Common.Math.b2Math.Dot(w2, e12);
	var d12_1 = w2e12;
	var d12_2 = (-w1e12);
	var e13 = Box2D.Common.Math.b2Math.SubtractVV(w3, w1);
	var w1e13 = Box2D.Common.Math.b2Math.Dot(w1, e13);
	var w3e13 = Box2D.Common.Math.b2Math.Dot(w3, e13);
	var d13_1 = w3e13;
	var d13_2 = (-w1e13);
	var e23 = Box2D.Common.Math.b2Math.SubtractVV(w3, w2);
	var w2e23 = Box2D.Common.Math.b2Math.Dot(w2, e23);
	var w3e23 = Box2D.Common.Math.b2Math.Dot(w3, e23);
	var d23_1 = w3e23;
	var d23_2 = (-w2e23);
	var n123 = Box2D.Common.Math.b2Math.CrossVV(e12, e13);
	var d123_1 = n123 * Box2D.Common.Math.b2Math.CrossVV(w2, w3);
	var d123_2 = n123 * Box2D.Common.Math.b2Math.CrossVV(w3, w1);
	var d123_3 = n123 * Box2D.Common.Math.b2Math.CrossVV(w1, w2);
	if (d12_2 <= 0.0 && d13_2 <= 0.0) {
		this.m_v1.a = 1.0;
		this.m_count = 1;
		return;
	}
	if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
		var inv_d12 = 1.0 / (d12_1 + d12_2);
		this.m_v1.a = d12_1 * inv_d12;
		this.m_v2.a = d12_2 * inv_d12;
		this.m_count = 2;
		return;
	}
	if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
		var inv_d13 = 1.0 / (d13_1 + d13_2);
		this.m_v1.a = d13_1 * inv_d13;
		this.m_v3.a = d13_2 * inv_d13;
		this.m_count = 2;
		this.m_v2.Set(this.m_v3);
		return;
	}
	if (d12_1 <= 0.0 && d23_2 <= 0.0) {
		this.m_v2.a = 1.0;
		this.m_count = 1;
		this.m_v1.Set(this.m_v2);
		return;
	}
	if (d13_1 <= 0.0 && d23_1 <= 0.0) {
		this.m_v3.a = 1.0;
		this.m_count = 1;
		this.m_v1.Set(this.m_v3);
		return;
	}
	if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
		var inv_d23 = 1.0 / (d23_1 + d23_2);
		this.m_v2.a = d23_1 * inv_d23;
		this.m_v3.a = d23_2 * inv_d23;
		this.m_count = 2;
		this.m_v1.Set(this.m_v3);
		return;
	}
	var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
	this.m_v1.a = d123_1 * inv_d123;
	this.m_v2.a = d123_2 * inv_d123;
	this.m_v3.a = d123_3 * inv_d123;
	this.m_count = 3;
};

/**
 * @constructor
 */
Box2D.Collision.b2SimplexCache = function() {
	this.indexA = [0, 0, 0];
	this.indexB = [0, 0, 0];
};

/**
 * @constructor
 */
Box2D.Collision.b2SimplexVertex = function() {};

Box2D.Collision.b2SimplexVertex.prototype.Set = function(other) {
	this.wA.SetV(other.wA);
	this.wB.SetV(other.wB);
	this.w.SetV(other.w);
	this.a = other.a;
	this.indexA = other.indexA;
	this.indexB = other.indexB;
};

/**
 * @constructor
 */
Box2D.Collision.b2TOIInput = function() {
	this.proxyA = new Box2D.Collision.b2DistanceProxy();
	this.proxyB = new Box2D.Collision.b2DistanceProxy();
	this.sweepA = new Box2D.Common.Math.b2Sweep();
	this.sweepB = new Box2D.Common.Math.b2Sweep();
};

Box2D.Collision.b2TimeOfImpact = {};

Box2D.Collision.b2TimeOfImpact.TimeOfImpact = function(input) {
	Box2D.Collision.b2TimeOfImpact.b2_toiCalls++;
	var proxyA = input.proxyA;
	var proxyB = input.proxyB;
	var sweepA = input.sweepA;
	var sweepB = input.sweepB;
	assert2(sweepA.t0 == sweepB.t0);
	assert2(1.0 - sweepA.t0 > Number.MIN_VALUE);
	var radius = proxyA.m_radius + proxyB.m_radius;
	var tolerance = input.tolerance;
	var alpha = 0.0;
	var k_maxIterations = 1000;
	var iter = 0;
	var target = 0.0;
	Box2D.Collision.b2TimeOfImpact.s_cache.count = 0;
	Box2D.Collision.b2TimeOfImpact.s_distanceInput.useRadii = false;
	for (;;) {
		sweepA.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfA, alpha);
		sweepB.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfB, alpha);
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.transformA = Box2D.Collision.b2TimeOfImpact.s_xfA;
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.transformB = Box2D.Collision.b2TimeOfImpact.s_xfB;
		Box2D.Collision.b2Distance.Distance(Box2D.Collision.b2TimeOfImpact.s_distanceOutput, Box2D.Collision.b2TimeOfImpact.s_cache, Box2D.Collision.b2TimeOfImpact.s_distanceInput);
		if (Box2D.Collision.b2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
			alpha = 1.0;
			break;
		}
		Box2D.Collision.b2TimeOfImpact.s_fcn.Initialize(Box2D.Collision.b2TimeOfImpact.s_cache, proxyA, Box2D.Collision.b2TimeOfImpact.s_xfA, proxyB, Box2D.Collision.b2TimeOfImpact.s_xfB);
		var separation = Box2D.Collision.b2TimeOfImpact.s_fcn.Evaluate(Box2D.Collision.b2TimeOfImpact.s_xfA, Box2D.Collision.b2TimeOfImpact.s_xfB);
		if (separation <= 0.0) {
			alpha = 1.0;
			break;
		}
		if (iter == 0) {
			if (separation > radius) {
				target = Math.max(radius - tolerance, 0.75 * radius);
			} else {
				target = Math.max(separation - tolerance, 0.02 * radius);
			}
		}
		if (separation - target < 0.5 * tolerance) {
			if (iter == 0) {
				alpha = 1.0;
				break;
			}
			break;
		}
		var newAlpha = alpha; {
			var x1 = alpha;
			var x2 = 1.0;
			var f1 = separation;
			sweepA.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfA, x2);
			sweepB.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfB, x2);
			var f2 = Box2D.Collision.b2TimeOfImpact.s_fcn.Evaluate(Box2D.Collision.b2TimeOfImpact.s_xfA, Box2D.Collision.b2TimeOfImpact.s_xfB);
			if (f2 >= target) {
				alpha = 1.0;
				break;
			}
			var rootIterCount = 0;
			for (;;) {
				var x = 0;
				if (rootIterCount & 1) {
					x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
				} else {
					x = 0.5 * (x1 + x2);
				}
				sweepA.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfA, x);
				sweepB.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfB, x);
				var f = Box2D.Collision.b2TimeOfImpact.s_fcn.Evaluate(Box2D.Collision.b2TimeOfImpact.s_xfA, Box2D.Collision.b2TimeOfImpact.s_xfB);
				if (Math.abs(f - target) < 0.025 * tolerance) {
					newAlpha = x;
					break;
				}
				if (f > target) {
					x1 = x;
					f1 = f;
				} else {
					x2 = x;
					f2 = f;
				}
				rootIterCount++;
				Box2D.Collision.b2TimeOfImpact.b2_toiRootIters++;
				if (rootIterCount == 50) {
					break;
				}
			}
			Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = Math.max(Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
		}
		if (newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha) {
			break;
		}
		alpha = newAlpha;
		iter++;
		Box2D.Collision.b2TimeOfImpact.b2_toiIters++;
		if (iter == k_maxIterations) {
			break;
		}
	}
	Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = Math.max(Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters, iter);
	return alpha;
};

/**
 * @constructor
 */
Box2D.Collision.b2WorldManifold = function() {
	/** @type  {!Box2D.Common.Math.b2Vec2} */
	this.m_normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {Array.<!Box2D.Common.Math.b2Vec2>} */
	this.m_points = [];
	
	/** @type {number} */
	this.m_pointCount = 0;
	
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};

/**
 * @param {!Box2D.Collision.b2Manifold} manifold
 * @param {!Box2D.Common.Math.b2Transform} xfA
 * @param {number} radiusA
 * @param {!Box2D.Common.Math.b2Transform} xfB
 * @param {number} radiusB
 */
Box2D.Collision.b2WorldManifold.prototype.Initialize = function(manifold, xfA, radiusA, xfB, radiusB) {
	if (manifold.m_pointCount == 0) {
		return;
	}
	var i = 0;
	var tVec;
	var tMat;
	var normalX = 0;
	var normalY = 0;
	var planePointX = 0;
	var planePointY = 0;
	var clipPointX = 0;
	var clipPointY = 0;
	switch (manifold.m_type) {
		case Box2D.Collision.b2Manifold.e_circles:
			tMat = xfA.R;
			tVec = manifold.m_localPoint;
			var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfB.R;
			tVec = manifold.m_points[0].m_localPoint;
			var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			var dX = pointBX - pointAX;
			var dY = pointBY - pointAY;
			var d2 = dX * dX + dY * dY;
			if (d2 > Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
				var d = Math.sqrt(d2);
				this.m_normal.x = dX / d;
				this.m_normal.y = dY / d;
			} else {
				this.m_normal.x = 1;
				this.m_normal.y = 0;
			}
			var cAX = pointAX + radiusA * this.m_normal.x;
			var cAY = pointAY + radiusA * this.m_normal.y;
			var cBX = pointBX - radiusB * this.m_normal.x;
			var cBY = pointBY - radiusB * this.m_normal.y;
			this.m_points[0].x = 0.5 * (cAX + cBX);
			this.m_points[0].y = 0.5 * (cAY + cBY);
			break;
		case Box2D.Collision.b2Manifold.e_faceA:
			tMat = xfA.R;
			tVec = manifold.m_localPlaneNormal;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfA.R;
			tVec = manifold.m_localPoint;
			planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			this.m_normal.x = normalX;
			this.m_normal.y = normalY;
			for (i = 0; i < manifold.m_pointCount; i++) {
				tMat = xfB.R;
				tVec = manifold.m_points[i].m_localPoint;
				clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
				this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
			}
			break;
		case Box2D.Collision.b2Manifold.e_faceB:
			tMat = xfB.R;
			tVec = manifold.m_localPlaneNormal;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfB.R;
			tVec = manifold.m_localPoint;
			planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			this.m_normal.x = (-normalX);
			this.m_normal.y = (-normalY);
			for (i = 0; i < manifold.m_pointCount; i++) {
				tMat = xfA.R;
				tVec = manifold.m_points[i].m_localPoint;
				clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
				this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
			}
			break;
	}
};

/**
 * @param {!Box2D.Dynamics.b2BodyDef} bd
 * @param {!Box2D.Dynamics.b2World} world
 * @constructor
 */
Box2D.Dynamics.b2Body = function(bd, world) {
	
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Body" + Box2D.Dynamics.b2Body.NEXT_ID++;
	
	/**
	 * @private
	 * @type {!Box2D.Common.Math.b2Transform}
	 */
	this.m_xf = new Box2D.Common.Math.b2Transform();
	this.m_xf.position.SetV(bd.position);
	this.m_xf.R.Set(bd.angle);

	/**
	 * @private
	 * @type {!Box2D.Common.Math.b2Sweep}
	 */
	this.m_sweep = new Box2D.Common.Math.b2Sweep();
	this.m_sweep.localCenter.SetZero();
	this.m_sweep.t0 = 1.0;
	this.m_sweep.a0 = this.m_sweep.a = bd.angle;
	this.m_sweep.c.x = (this.m_xf.R.col1.x * this.m_sweep.localCenter.x + this.m_xf.R.col2.x * this.m_sweep.localCenter.y);
	this.m_sweep.c.y = (this.m_xf.R.col1.y * this.m_sweep.localCenter.x + this.m_xf.R.col2.y * this.m_sweep.localCenter.y);
	this.m_sweep.c.x += this.m_xf.position.x;
	this.m_sweep.c.y += this.m_xf.position.y;
	this.m_sweep.c0.SetV(this.m_sweep.c);
	
	/**
	  * @private
	  * @type {!Box2D.Common.Math.b2Vec2}
	  */
	this.m_linearVelocity = bd.linearVelocity.Copy();
	
	/**
	  * @private
	  * @type {!Box2D.Common.Math.b2Vec2}
	  */
	this.m_force = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_bullet = bd.bullet;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_fixedRotation = bd.fixedRotation;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_allowSleep = bd.allowSleep;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_awake = bd.awake;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_active = bd.active;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2World}
	 */
	this.m_world = world;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Joints.b2Joint}
	 */
	this.m_jointList = null;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	 this.contactList = new Box2D.Dynamics.Contacts.b2ContactList();
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Controllers.b2ControllerList}
	 */
	this.controllerList = new Box2D.Dynamics.Controllers.b2ControllerList();
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_controllerCount = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_angularVelocity = bd.angularVelocity;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_linearDamping = bd.linearDamping;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_angularDamping = bd.angularDamping;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_torque = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_sleepTime = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_type = bd.type;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_mass = this.m_type == Box2D.Dynamics.b2BodyDef.b2_dynamicBody ? 1 : 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_invMass = this.m_type == Box2D.Dynamics.b2BodyDef.b2_dynamicBody ? 1 : 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_I = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_invI = 0;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_inertiaScale = bd.inertiaScale;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2FixtureList}
	 */
	this.fixtureList = new Box2D.Dynamics.b2FixtureList();
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2BodyList>}
	 */
	 this.m_lists = [];
};

/**
 * @param {!Box2D.Dynamics.b2FixtureDef} def
 */
Box2D.Dynamics.b2Body.prototype.CreateFixture = function(def) {
	assert2(!this.m_world.IsLocked());
	var fixture = new Box2D.Dynamics.b2Fixture(this, this.m_xf, def);
	if (this.m_active) {
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		fixture.CreateProxy(broadPhase, this.m_xf);
	}
	this.fixtureList.AddFixture(fixture);
	fixture.m_body = this;
	if (fixture.m_density > 0.0) {
		this.ResetMassData();
	}
	this.m_world.m_newFixture = true;
	return fixture;
};

Box2D.Dynamics.b2Body.prototype.CreateFixture2 = function(shape, density) {
	if (density === undefined) density = 0.0;
	var def = new Box2D.Dynamics.b2FixtureDef();
	def.shape = shape;
	def.density = density;
	return this.CreateFixture(def);
};

Box2D.Dynamics.b2Body.prototype.Destroy = function() {
	// These should also be freed
	//this.m_xf = new Box2D.Common.Math.b2Transform();
	//this.m_sweep = new Box2D.Common.Math.b2Sweep();
	Box2D.Common.Math.b2Vec2.Free(this.m_linearVelocity);
	Box2D.Common.Math.b2Vec2.Free(this.m_force);
};

Box2D.Dynamics.b2Body.prototype.DestroyFixture = function(fixture) {
	assert2(!this.m_world.IsLocked());
	this.fixtureList.RemoveFixture(fixture);
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		if (fixture == contactNode.contact.m_fixtureA || fixture == contactNode.contact.m_fixtureB) {
			this.m_world.m_contactManager.Destroy(contactNode.contact);
		}
	}
	if (this.m_active) {
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		fixture.DestroyProxy(broadPhase);
	}
	fixture.Destroy();
	fixture.m_body = null;
	this.ResetMassData();
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} position
 * @param {number} angle
 */
Box2D.Dynamics.b2Body.prototype.SetPositionAndAngle = function(position, angle) {
	assert2(!this.m_world.IsLocked());
	this.m_xf.R.Set(angle);
	this.m_xf.position.SetV(position);
	var tMat = this.m_xf.R;
	var tVec = this.m_sweep.localCenter;
	this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	this.m_sweep.c.x += this.m_xf.position.x;
	this.m_sweep.c.y += this.m_xf.position.y;
	this.m_sweep.c0.SetV(this.m_sweep.c);
	this.m_sweep.a0 = this.m_sweep.a = angle;
	var broadPhase = this.m_world.m_contactManager.m_broadPhase;
	
	for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		node.fixture.Synchronize(broadPhase, this.m_xf, this.m_xf);
	}
	this.m_world.m_contactManager.FindNewContacts();
};

/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 */
Box2D.Dynamics.b2Body.prototype.SetTransform = function(xf) {
	this.SetPositionAndAngle(xf.position, xf.GetAngle());
};

/**
 * @return {!Box2D.Common.Math.b2Transform}
 */
Box2D.Dynamics.b2Body.prototype.GetTransform = function() {
	return this.m_xf;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Dynamics.b2Body.prototype.GetPosition = function() {
	return this.m_xf.position;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} position
 */
Box2D.Dynamics.b2Body.prototype.SetPosition = function(position) {
	this.SetPositionAndAngle(position, this.GetAngle());
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetAngle = function() {
	return this.m_sweep.a;
};

/**
 * @param {number} angle
 */
Box2D.Dynamics.b2Body.prototype.SetAngle = function(angle) {
	this.SetPositionAndAngle(this.GetPosition(), angle);
};

Box2D.Dynamics.b2Body.prototype.GetWorldCenter = function() {
	return this.m_sweep.c;
};

Box2D.Dynamics.b2Body.prototype.GetLocalCenter = function() {
	return this.m_sweep.localCenter;
};

Box2D.Dynamics.b2Body.prototype.SetLinearVelocity = function(v) {
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		return;
	}
	this.m_linearVelocity.SetV(v);
};

Box2D.Dynamics.b2Body.prototype.GetLinearVelocity = function() {
	return this.m_linearVelocity;
};

Box2D.Dynamics.b2Body.prototype.SetAngularVelocity = function(omega) {
	if (omega === undefined) omega = 0;
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		return;
	}
	this.m_angularVelocity = omega;
};

Box2D.Dynamics.b2Body.prototype.GetAngularVelocity = function() {
	return this.m_angularVelocity;
};

Box2D.Dynamics.b2Body.prototype.GetDefinition = function() {
	var bd = new Box2D.Dynamics.b2BodyDef();
	bd.type = this.GetType();
	bd.allowSleep = this.m_allowSleep;
	bd.angle = this.GetAngle();
	bd.angularDamping = this.m_angularDamping;
	bd.angularVelocity = this.m_angularVelocity;
	bd.fixedRotation = this.m_fixedRotation;
	bd.bullet = this.m_bullet;
	bd.active = this.m_active;
	bd.awake = this.m_awake;
	bd.linearDamping = this.m_linearDamping;
	bd.linearVelocity.SetV(this.GetLinearVelocity());
	bd.position = this.GetPosition();
	return bd;
};

Box2D.Dynamics.b2Body.prototype.ApplyForce = function(force, point) {
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.SetAwake(true);
	
	this.m_force.x += force.x;
	this.m_force.y += force.y;
	this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
};

Box2D.Dynamics.b2Body.prototype.ApplyTorque = function(torque) {
	if (torque === undefined) torque = 0;
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.SetAwake(true);
	
	this.m_torque += torque;
};

Box2D.Dynamics.b2Body.prototype.ApplyImpulse = function(impulse, point) {
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.SetAwake(true);
	
	this.m_linearVelocity.x += this.m_invMass * impulse.x;
	this.m_linearVelocity.y += this.m_invMass * impulse.y;
	this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
};

Box2D.Dynamics.b2Body.prototype.Split = function(callback) {
	var linearVelocity = this.GetLinearVelocity().Copy();
	var angularVelocity = this.GetAngularVelocity();
	var center = this.GetWorldCenter();
	var body1 = this;
	var body2 = this.m_world.CreateBody(this.GetDefinition());
	var prev;
	for (var node = body1.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		var f = node.fixture;
		if (callback(f)) {
			body1.fixtureList.RemoveFixture(f);
			body2.fixtureList.AddFixture(f);
		}
	}
	body1.ResetMassData();
	body2.ResetMassData();
	var center1 = body1.GetWorldCenter();
	var center2 = body2.GetWorldCenter();
	var velocity1 = Box2D.Common.Math.b2Math.AddVV(linearVelocity, Box2D.Common.Math.b2Math.CrossFV(angularVelocity, Box2D.Common.Math.b2Math.SubtractVV(center1, center)));
	var velocity2 = Box2D.Common.Math.b2Math.AddVV(linearVelocity, Box2D.Common.Math.b2Math.CrossFV(angularVelocity, Box2D.Common.Math.b2Math.SubtractVV(center2, center)));
	body1.SetLinearVelocity(velocity1);
	body2.SetLinearVelocity(velocity2);
	body1.SetAngularVelocity(angularVelocity);
	body2.SetAngularVelocity(angularVelocity);
	body1.SynchronizeFixtures();
	body2.SynchronizeFixtures();
	return body2;
};

Box2D.Dynamics.b2Body.prototype.Merge = function(other) {
	for (var node = other.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		this.fixtureList.AddFixture(node.fixture);
		other.fixtureList.RemoveFixture(node.fixture);
	}
	other.ResetMassData();
	this.ResetMassData();
	this.SynchronizeFixtures();
};

Box2D.Dynamics.b2Body.prototype.GetMass = function() {
	return this.m_mass;
};

Box2D.Dynamics.b2Body.prototype.GetInertia = function() {
	return this.m_I;
};

/**
 * @param {Box2D.Collision.Shapes.b2MassData=} massData
 * @return {!Box2D.Collision.Shapes.b2MassData}
 */
Box2D.Dynamics.b2Body.prototype.GetMassData = function(massData) {
	if (!massData) {
		massData = new Box2D.Collision.Shapes.b2MassData();
	}
	massData.mass = this.m_mass;
	massData.I = this.m_I;
	massData.center.SetV(this.m_sweep.localCenter);
	return massData;
};

/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 */
Box2D.Dynamics.b2Body.prototype.SetMassData = function(massData) {
	assert2(!this.m_world.IsLocked());
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.m_invMass = 0.0;
	this.m_I = 0.0;
	this.m_invI = 0.0;
	this.m_mass = massData.mass;
	if (this.m_mass <= 0.0) {
		this.m_mass = 1.0;
	}
	this.m_invMass = 1.0 / this.m_mass;
	if (massData.I > 0.0 && !this.m_fixedRotation) {
		this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
		this.m_invI = 1.0 / this.m_I;
	}
	var oldCenter = this.m_sweep.c.Copy();
	this.m_sweep.localCenter.SetV(massData.center);
	this.m_sweep.c0.SetV(Box2D.Common.Math.b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
	this.m_sweep.c.SetV(this.m_sweep.c0);
	this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
	this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
};

Box2D.Dynamics.b2Body.prototype.ResetMassData = function() {
	this.m_mass = 0.0;
	this.m_invMass = 0.0;
	this.m_I = 0.0;
	this.m_invI = 0.0;
	this.m_sweep.localCenter.SetZero();
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody || this.m_type == Box2D.Dynamics.b2BodyDef.b2_kinematicBody) {
		return;
	}
	var center = Box2D.Common.Math.b2Vec2.Get(0, 0);
	for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		var f = node.fixture;
		if (f.m_density == 0.0) {
			continue;
		}
		var massData = f.GetMassData();
		this.m_mass += massData.mass;
		center.x += massData.center.x * massData.mass;
		center.y += massData.center.y * massData.mass;
		this.m_I += massData.I;
	}
	if (this.m_mass > 0.0) {
		this.m_invMass = 1.0 / this.m_mass;
		center.x *= this.m_invMass;
		center.y *= this.m_invMass;
	} else {
		this.m_mass = 1.0;
		this.m_invMass = 1.0;
	}
	if (this.m_I > 0.0 && !this.m_fixedRotation) {
		this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
		this.m_I *= this.m_inertiaScale;
		assert2(this.m_I > 0);
		this.m_invI = 1.0 / this.m_I;
	} else {
		this.m_I = 0.0;
		this.m_invI = 0.0;
	}
	var oldCenter = this.m_sweep.c.Copy();
	this.m_sweep.localCenter.SetV(center);
	this.m_sweep.c0.SetV(Box2D.Common.Math.b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
	this.m_sweep.c.SetV(this.m_sweep.c0);
	this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
	this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
	Box2D.Common.Math.b2Vec2.Free(center);
	Box2D.Common.Math.b2Vec2.Free(oldCenter);
};

Box2D.Dynamics.b2Body.prototype.GetWorldPoint = function(localPoint) {
	var A = this.m_xf.R;
	var u = Box2D.Common.Math.b2Vec2.Get(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
	u.x += this.m_xf.position.x;
	u.y += this.m_xf.position.y;
	return u;
};

Box2D.Dynamics.b2Body.prototype.GetWorldVector = function(localVector) {
	return Box2D.Common.Math.b2Math.MulMV(this.m_xf.R, localVector);
};

Box2D.Dynamics.b2Body.prototype.GetLocalPoint = function(worldPoint) {
	return Box2D.Common.Math.b2Math.MulXT(this.m_xf, worldPoint);
};

Box2D.Dynamics.b2Body.prototype.GetLocalVector = function(worldVector) {
	return Box2D.Common.Math.b2Math.MulTMV(this.m_xf.R, worldVector);
};

Box2D.Dynamics.b2Body.prototype.GetLinearVelocityFromWorldPoint = function(worldPoint) {
	return Box2D.Common.Math.b2Vec2.Get(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
};

Box2D.Dynamics.b2Body.prototype.GetLinearVelocityFromLocalPoint = function(localPoint) {
	var A = this.m_xf.R;
	var worldPoint = Box2D.Common.Math.b2Vec2.Get(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
	worldPoint.x += this.m_xf.position.x;
	worldPoint.y += this.m_xf.position.y;
	var velocity = Box2D.Common.Math.b2Vec2.Get(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
	Box2D.Common.Math.b2Vec2.Free(worldPoint);
	return velocity;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetLinearDamping = function() {
	return this.m_linearDamping;
};

/**
 * @param {number} linearDamping
 */
Box2D.Dynamics.b2Body.prototype.SetLinearDamping = function(linearDamping) {
	this.m_linearDamping = linearDamping;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetAngularDamping = function() {
	return this.m_angularDamping;
};

/**
 * @param {number} angularDamping
 */
Box2D.Dynamics.b2Body.prototype.SetAngularDamping = function(angularDamping) {
	this.m_angularDamping = angularDamping;
};

/**
 * @param {number} type
 */
Box2D.Dynamics.b2Body.prototype.SetType = function(type) {
	if (this.m_type == type) {
		return;
	}
	this.m_type = type;
	this.ResetMassData();
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		this.m_linearVelocity.SetZero();
		this.m_angularVelocity = 0.0;
	}
	this.SetAwake(true);
	this.m_force.SetZero();
	this.m_torque = 0.0;
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		contactNode.contact.FlagForFiltering();
	}
	for (var i = 0; i < this.m_lists.length; i++) {
		this.m_lists[i].UpdateBody(this);
	}
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetType = function() {
	return this.m_type;
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetBullet = function(flag) {
	this.m_bullet = flag;
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsBullet = function() {
	return this.m_bullet;
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetSleepingAllowed = function(flag) {
	this.m_allowSleep = flag;
	if (!flag) {
		this.SetAwake(true);
	}
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetAwake = function(flag) {
	if (this.m_awake != flag) {
		this.m_awake = flag;
		this.m_sleepTime = 0;
		if (!flag) {
			this.m_linearVelocity.SetZero();
			this.m_angularVelocity = 0.0;
			this.m_force.SetZero();
			this.m_torque = 0.0;
		}
		for (var i = 0; i < this.m_lists.length; i++) {
			this.m_lists[i].UpdateBody(this);
		}
	}
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsAwake = function() {
	return this.m_awake;
};

/**
 * @param {boolean} fixed
 */
Box2D.Dynamics.b2Body.prototype.SetFixedRotation = function(fixed) {
	this.m_fixedRotation = fixed;
	this.ResetMassData();
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsFixedRotation = function() {
	return this.m_fixedRotation;
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetActive = function(flag) {
	if (flag == this.m_active) {
		return;
	}
	if (flag) {
		this.m_active = true;
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
			node.fixture.CreateProxy(broadPhase, this.m_xf);
		}
	} else {
		this.m_active = false;
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
			node.fixture.DestroyProxy(broadPhase);
		}
		for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
			this.m_world.m_contactManager.Destroy(contactNode.contact);
		}
	}
	for (var i = 0; i < this.m_lists.length; i++) {
		this.m_lists[i].UpdateBody(this);
	}
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsActive = function() {
	return this.m_active;
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsSleepingAllowed = function() {
	return this.m_allowSleep;
};

Box2D.Dynamics.b2Body.prototype.GetFixtureList = function() {
	return this.fixtureList;
};

Box2D.Dynamics.b2Body.prototype.GetJointList = function() {
	return this.m_jointList;
};

Box2D.Dynamics.b2Body.prototype.GetControllerList = function() {
	return this.controllerList;
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.b2Body.prototype.AddController = function(controller) {
	this.controllerList.AddController(controller);
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.b2Body.prototype.RemoveController = function(controller) {
	this.controllerList.RemoveController(controller);
};

Box2D.Dynamics.b2Body.prototype.GetContactList = function() {
	return this.contactList;
};

Box2D.Dynamics.b2Body.prototype.GetWorld = function() {
	return this.m_world;
};

Box2D.Dynamics.b2Body.prototype.SynchronizeFixtures = function() {
	var xf1 = Box2D.Dynamics.b2Body.s_xf1;
	xf1.R.Set(this.m_sweep.a0);
	var tMat = xf1.R;
	var tVec = this.m_sweep.localCenter;
	xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var f;
	var broadPhase = this.m_world.m_contactManager.m_broadPhase;
	for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		node.fixture.Synchronize(broadPhase, xf1, this.m_xf);
	}
};

Box2D.Dynamics.b2Body.prototype.SynchronizeTransform = function() {
	this.m_xf.R.Set(this.m_sweep.a);
	var tMat = this.m_xf.R;
	var tVec = this.m_sweep.localCenter;
	this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
};

Box2D.Dynamics.b2Body.prototype.ShouldCollide = function(other) {
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody && other.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return false;
	}
	for (var jn = this.m_jointList; jn; jn = jn.next) {
		if (jn.other == other) if (jn.joint.m_collideConnected == false) {
			return false;
		}
	}
	return true;
};

/**
 * @param {number} t
 */
Box2D.Dynamics.b2Body.prototype.Advance = function(t) {
	this.m_sweep.Advance(t);
	this.m_sweep.c.SetV(this.m_sweep.c0);
	this.m_sweep.a = this.m_sweep.a0;
	this.SynchronizeTransform();
};

/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.b2Body.NEXT_ID = 0;

/**
 * @constructor
 */
Box2D.Dynamics.b2BodyDef = function() {
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.position = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.linearVelocity = Box2D.Common.Math.b2Vec2.Get(0, 0);
	
	/** @type {number} */
	this.angle = 0.0;
	
	/** @type {number} */
	this.angularVelocity = 0.0;
	
	/** @type {number} */
	this.linearDamping = 0.0;
	
	/** @type {number} */
	this.angularDamping = 0.0;
	
	/** @type {boolean} */
	this.allowSleep = true;
	
	/** @type {boolean} */
	this.awake = true;
	
	/** @type {boolean} */
	this.fixedRotation = false;
	
	/** @type {boolean} */
	this.bullet = false;
	
	/** @type {number} */
	this.type = Box2D.Dynamics.b2BodyDef.b2_staticBody;
	
	/** @type {boolean} */
	this.active = true;
	
	/** @type {number} */
	this.inertiaScale = 1.0;
};

/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2BodyDef.b2_staticBody = 0;

/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2BodyDef.b2_kinematicBody = 1;

/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2BodyDef.b2_dynamicBody = 2;

/**
 * @constructor
 */
Box2D.Dynamics.b2BodyList = function() {
	
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.b2BodyListNode>}
	 */
	this.bodyFirstNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
		this.bodyFirstNodes[i] = null;
	}
	
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.b2BodyListNode>}
	 */
	this.bodyLastNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
		this.bodyLastNodes[i] = null;
	}
	
	/**
	 * @private
	 * @type {Object.<Array.<Box2D.Dynamics.b2BodyListNode>>}
	 */
	this.bodyNodeLookup = {};
	
	/**
	 * @private
	 * @type {number}
	 */
	this.bodyCount = 0;
};

/**
 * @param {number} type
 * @return {Box2D.Dynamics.b2BodyListNode}
 */
Box2D.Dynamics.b2BodyList.prototype.GetFirstNode = function(type) {
	return this.bodyFirstNodes[type];
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2BodyList.prototype.AddBody = function(body) {
	var bodyID = body.ID;
	if (this.bodyNodeLookup[bodyID] == null) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.allBodies);
		this.UpdateBody(body);
		body.m_lists.push(this);
		this.bodyCount++;
	}
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2BodyList.prototype.UpdateBody = function(body) {
	var type = body.GetType();
	var bodyID = body.ID;
	var awake = body.IsAwake();
	var active = body.IsActive();
	if (type == Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.dynamicBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.dynamicBodies);
	}
	if (type != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticBodies);
	}
	if (type != Box2D.Dynamics.b2BodyDef.b2_staticBody && active && awake) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies);
	}
	if (awake) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.awakeBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.awakeBodies);
	}
	if (active) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.activeBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.activeBodies);
	}
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2BodyList.prototype.RemoveBody = function(body) {
	var bodyID = body.ID;
	if (this.bodyNodeLookup[bodyID] != null) {
		cr.arrayFindRemove(body.m_lists, this);
		for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
			this.RemoveNode(bodyID, i);
		}
		delete this.bodyNodeLookup[bodyID];
		this.bodyCount--;
	}
};

/**
 * @param {string} bodyID
 * @param {number} type
 */
Box2D.Dynamics.b2BodyList.prototype.RemoveNode = function(bodyID, type) {
	var nodeList = this.bodyNodeLookup[bodyID];
	if (nodeList == null) {
		return;
	}
	var node = nodeList[type];
	if (node == null) {
		return;
	}
	nodeList[type] = null;
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.bodyFirstNodes[type] = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.bodyLastNodes[type] = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @param {string} bodyID
 * @param {number} type
 */
Box2D.Dynamics.b2BodyList.prototype.CreateNode = function(body, bodyID, type) {
	var nodeList = this.bodyNodeLookup[bodyID];
	if (nodeList == null) {
		nodeList = [];
		for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
			nodeList[i] = null;
		}
		this.bodyNodeLookup[bodyID] = nodeList;
	}
	if (nodeList[type] == null) {
		nodeList[type] = new Box2D.Dynamics.b2BodyListNode(body);
		var prevNode = this.bodyLastNodes[type];
		if (prevNode != null) {
			prevNode.SetNextNode(nodeList[type]);
		} else {
			this.bodyFirstNodes[type] = nodeList[type];
		}
		nodeList[type].SetPreviousNode(prevNode);
		this.bodyLastNodes[type] = nodeList[type];
	}
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2BodyList.prototype.GetBodyCount = function() {
	return this.bodyCount;
};

/**
 * @enum {number}
 */
Box2D.Dynamics.b2BodyList.TYPES = {
	dynamicBodies: 0,
	nonStaticBodies: 1,
	activeBodies: 2,
	nonStaticActiveAwakeBodies: 3,
	awakeBodies: 4,
	allBodies: 5 // Assumed to be last by above code
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @constructor
 */
Box2D.Dynamics.b2BodyListNode = function(body) {
	
	/**
	 * @const
	 * @type {!Box2D.Dynamics.b2Body}
	 */
	this.body = body;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2BodyListNode}
	 */
	this.next = null;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2BodyListNode}
	 */
	this.previous = null;
};

/**
 * @param {Box2D.Dynamics.b2BodyListNode} node
 */
Box2D.Dynamics.b2BodyListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};

/**
 * @param {Box2D.Dynamics.b2BodyListNode} node
 */
Box2D.Dynamics.b2BodyListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};

/**
 * @return {Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2BodyListNode.prototype.GetBody = function() {
	return this.body;
};

/**
 * @return {Box2D.Dynamics.b2BodyListNode}
 */
Box2D.Dynamics.b2BodyListNode.prototype.GetNextNode = function() {
	return this.next;
};

/**
 * @return {Box2D.Dynamics.b2BodyListNode}
 */
Box2D.Dynamics.b2BodyListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};

/**
 * @constructor
 */
Box2D.Dynamics.b2ContactFilter = function() {};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @return {boolean}
 */
Box2D.Dynamics.b2ContactFilter.prototype.ShouldCollide = function(fixtureA, fixtureB) {
	var filter1 = fixtureA.GetFilterData();
	var filter2 = fixtureB.GetFilterData();
	if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
		return filter1.groupIndex > 0;
	}
	return (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
};

/** @type {!Box2D.Dynamics.b2ContactFilter} */
Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new Box2D.Dynamics.b2ContactFilter();

/**
 * @constructor
 */
Box2D.Dynamics.b2ContactImpulse = function () {
	this.normalImpulses = [];
	this.tangentImpulses = [];
};

/**
 * @constructor
 */
Box2D.Dynamics.b2ContactListener = function () {};

Box2D.Dynamics.b2ContactListener.prototype.BeginContact = function (contact) {};

Box2D.Dynamics.b2ContactListener.prototype.EndContact = function (contact) {};

Box2D.Dynamics.b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {};

Box2D.Dynamics.b2ContactListener.prototype.PostSolve = function (contact, impulse) {};

/**
 * @param {!Box2D.Dynamics.b2World} world
 * @constructor
 */
Box2D.Dynamics.b2ContactManager = function(world) {
	
	/**
	 * @private
	 * @const
	 * @type {!Box2D.Dynamics.b2World}
	 */
	this.m_world = world;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactFilter}
	 */
	this.m_contactFilter = Box2D.Dynamics.b2ContactFilter.b2_defaultFilter;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactListener}
	 */
	this.m_contactListener = Box2D.Dynamics.b2ContactListener.b2_defaultListener;
	
	/**
	 * @private
	 * @const
	 * @type {!Box2D.Dynamics.Contacts.b2ContactFactory}
	 */
	this.m_contactFactory = new Box2D.Dynamics.Contacts.b2ContactFactory();
	
	/**
	 * @private
	 * @type {!Box2D.Collision.b2DynamicTreeBroadPhase}
	 */
	this.m_broadPhase = new Box2D.Collision.b2DynamicTreeBroadPhase();
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.b2ContactManager.prototype.AddPair = function (fixtureA, fixtureB) {
  var bodyA = fixtureA.GetBody();
  var bodyB = fixtureB.GetBody();
  if (bodyA == bodyB) {
	  return;
  }
  if (!bodyB.ShouldCollide(bodyA)) {
	 return;
  }
  if (!this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
	 return;
  }
  for (var contactNode = bodyB.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
	var fA = contactNode.contact.m_fixtureA;
	if (fA == fixtureA) {
		var fB = contactNode.contact.m_fixtureB;
		if (fB == fixtureB) {
			return;
		}
	} else if (fA == fixtureB) {
		var fB = contactNode.contact.m_fixtureB;
		if (fB == fixtureA) {
			return;
		}
	}
  }
  var c = this.m_contactFactory.Create(fixtureA, fixtureB);
};

Box2D.Dynamics.b2ContactManager.prototype.FindNewContacts = function () {
	var self = this;
	/** @type {function(!Box2D.Dynamics.b2Fixture, !Box2D.Dynamics.b2Fixture)} */
	var addPairCallback = function(fixtureA, fixtureB) {
		self.AddPair(fixtureA, fixtureB)
	};
	this.m_broadPhase.UpdatePairs(addPairCallback);
};

Box2D.Dynamics.b2ContactManager.prototype.Destroy = function (c) {
	var fixtureA = c.m_fixtureA;
	var fixtureB = c.m_fixtureB;
	var bodyA = fixtureA.GetBody();
	var bodyB = fixtureB.GetBody();
	if (c.touching) {
		this.m_contactListener.EndContact(c);
	}
	if (c.m_manifold.m_pointCount > 0) {
		c.m_fixtureA.GetBody().SetAwake(true);
		c.m_fixtureB.GetBody().SetAwake(true);
	}
	c.RemoveFromLists();
	this.m_contactFactory.Destroy(c);
};

Box2D.Dynamics.b2ContactManager.prototype.Collide = function() {
	for (var contactNode = this.m_world.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		var c = contactNode.contact;
		var fixtureA = c.m_fixtureA;
		var fixtureB = c.m_fixtureB;
		var bodyA = fixtureA.GetBody();
		var bodyB = fixtureB.GetBody();
		if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
			continue;
		}
		if (c.IsFiltering()) {
			if (bodyB.ShouldCollide(bodyA) == false) {
				this.Destroy(c);
				continue;
			}
			if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
				this.Destroy(c);
				continue;
			}
			c.ClearFiltering();
		}
		var proxyA = fixtureA.m_proxy;
		var proxyB = fixtureB.m_proxy;
		var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
		if (overlap == false) {
			this.Destroy(c);
			continue;
		}
		c.Update(this.m_contactListener);
	}
};

/**
 * @constructor
 */
Box2D.Dynamics.b2DestructionListener = function () {};

Box2D.Dynamics.b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {};

Box2D.Dynamics.b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {};

/**
 * @constructor
 */
Box2D.Dynamics.b2FilterData = function () {
  this.categoryBits = 0x0001;
  this.maskBits = 0xFFFF;
  this.groupIndex = 0;
};

/**
 * @return {!Box2D.Dynamics.b2FilterData}
 */
Box2D.Dynamics.b2FilterData.prototype.Copy = function () {
  var copy = new Box2D.Dynamics.b2FilterData();
  copy.categoryBits = this.categoryBits;
  copy.maskBits = this.maskBits;
  copy.groupIndex = this.groupIndex;
  return copy;
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Dynamics.b2FixtureDef} def
 * @constructor
 */
Box2D.Dynamics.b2Fixture = function(body, xf, def) {
	
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Fixture" + Box2D.Dynamics.b2Fixture.NEXT_ID++;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2FilterData}
	 */
	this.m_filter = def.filter.Copy();

	/**
	 * @private
	 * @type {!Box2D.Collision.b2AABB}
	 */
	this.m_aabb = Box2D.Collision.b2AABB.Get();
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Body}
	 */
	this.m_body = body;
	
	/**
	 * @private
	 * @type {!Box2D.Collision.Shapes.b2Shape}
	 */
	this.m_shape = def.shape.Copy();
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_density = def.density;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_friction = def.friction;
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_restitution = def.restitution;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_isSensor = def.isSensor;
};

/**
 * @return {!Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Dynamics.b2Fixture.prototype.GetShape = function() {
	return this.m_shape;
};

/**
 * @param {boolean} sensor
 */
Box2D.Dynamics.b2Fixture.prototype.SetSensor = function(sensor) {
	if (this.m_isSensor == sensor) {
		return;
	}
	this.m_isSensor = sensor;
	if (this.m_body == null) {
		return;
	}
	for (var contactNode = this.m_body.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		var fixtureA = contactNode.contact.m_fixtureA;
		var fixtureB = contactNode.contact.m_fixtureB;
		if (fixtureA == this || fixtureB == this) {
			contactNode.contact.SetSensor(fixtureA.sensor || fixtureB.sensor);
		}
	}
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Fixture.prototype.IsSensor = function() {
	return this.m_isSensor;
};

/**
 * @param {!Box2D.Dynamics.b2FilterData} filter
 */
Box2D.Dynamics.b2Fixture.prototype.SetFilterData = function(filter) {
	this.m_filter = filter.Copy();
	if (this.m_body == null) {
		return;
	}
	for (var contactNode = this.m_body.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		if (contactNode.contact.m_fixtureA == this || contactNode.contact.m_fixtureB == this) {
			contactNode.contact.FlagForFiltering();
		}
	}
};

/**
 * @return {!Box2D.Dynamics.b2FilterData}
 */
Box2D.Dynamics.b2Fixture.prototype.GetFilterData = function() {
	return this.m_filter.Copy();
};

/**
 * @return {Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2Fixture.prototype.GetBody = function() {
	return this.m_body;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Dynamics.b2Fixture.prototype.TestPoint = function(p) {
	return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
};

/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @return {boolean}
 */
Box2D.Dynamics.b2Fixture.prototype.RayCast = function(output, input) {
	return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
};

/**
 * @param {Box2D.Collision.Shapes.b2MassData=} massData
 * @return {!Box2D.Collision.Shapes.b2MassData}
 */
Box2D.Dynamics.b2Fixture.prototype.GetMassData = function(massData) {
	if (!massData) {
		massData = new Box2D.Collision.Shapes.b2MassData();
	}
	this.m_shape.ComputeMass(massData, this.m_density);
	return massData;
};

/**
 * @param {number} density
 */
Box2D.Dynamics.b2Fixture.prototype.SetDensity = function(density) {
	this.m_density = density;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Fixture.prototype.GetDensity = function() {
	return this.m_density;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Fixture.prototype.GetFriction = function() {
	return this.m_friction;
};

/**
 * @param {number} friction
 */
Box2D.Dynamics.b2Fixture.prototype.SetFriction = function(friction) {
	this.m_friction = friction;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2Fixture.prototype.GetRestitution = function() {
	return this.m_restitution;
};

/**
 * @param {number} restitution
 */
Box2D.Dynamics.b2Fixture.prototype.SetRestitution = function(restitution) {
	this.m_restitution = restitution;
};

/**
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Dynamics.b2Fixture.prototype.GetAABB = function() {
	return this.m_aabb;
};

Box2D.Dynamics.b2Fixture.prototype.Destroy = function() {
	Box2D.Collision.b2AABB.Free(this.m_aabb);
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 * @param {!Box2D.Common.Math.b2Transform} xf
 */
Box2D.Dynamics.b2Fixture.prototype.CreateProxy = function(broadPhase, xf) {
	this.m_shape.ComputeAABB(this.m_aabb, xf);
	this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 */
Box2D.Dynamics.b2Fixture.prototype.DestroyProxy = function(broadPhase) {
	if (this.m_proxy == null) {
		return;
	}
	broadPhase.DestroyProxy(this.m_proxy);
	this.m_proxy = null;
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 * @param {!Box2D.Common.Math.b2Transform} transform1
 * @param {!Box2D.Common.Math.b2Transform} transform2
 */
Box2D.Dynamics.b2Fixture.prototype.Synchronize = function(broadPhase, transform1, transform2) {
	if (!this.m_proxy) return;
	
	var aabb1 = Box2D.Collision.b2AABB.Get();
	var aabb2 = Box2D.Collision.b2AABB.Get();
	this.m_shape.ComputeAABB(aabb1, transform1);
	this.m_shape.ComputeAABB(aabb2, transform2);
	this.m_aabb.Combine(aabb1, aabb2);
	Box2D.Collision.b2AABB.Free(aabb1);
	Box2D.Collision.b2AABB.Free(aabb2);
	
	var displacement = Box2D.Common.Math.b2Math.SubtractVV(transform2.position, transform1.position);
	broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
	Box2D.Common.Math.b2Vec2.Free(displacement);
};

/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.b2Fixture.NEXT_ID = 0;

/**
 * @constructor
 */
Box2D.Dynamics.b2FixtureDef = function () {
	
	/**
	 * @type {!Box2D.Dynamics.b2FilterData}
	 */
	this.filter = new Box2D.Dynamics.b2FilterData();
	this.filter.categoryBits = 0x0001;
	this.filter.maskBits = 0xFFFF;
	this.filter.groupIndex = 0;
	
	/**
	 * @type {Box2D.Collision.Shapes.b2Shape}
	 */
	this.shape = null;
	
	/**
	 * @type {number}
	 */
	this.friction = 0.2;
	
	/**
	 * @type {number}
	 */
	this.restitution = 0.0;
	
	/**
	 * @type {number}
	 */
	this.density = 0.0;
	
	/**
	 * @type {boolean}
	 */
	this.isSensor = false;
};

/**
 * @constructor
 */
Box2D.Dynamics.b2FixtureList = function() {
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.fixtureFirstNode = null;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.fixtureLastNode = null;
	
	/**
	 * @private
	 * @type {Object.<Box2D.Dynamics.b2FixtureListNode>}
	 */
	this.fixtureNodeLookup = {};
	
	/**
	 * @private
	 * @type {number}
	 */
	this.fixtureCount = 0;
};

/**
 * @return {Box2D.Dynamics.b2FixtureListNode}
 */
Box2D.Dynamics.b2FixtureList.prototype.GetFirstNode = function() {
	return this.fixtureFirstNode;
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixture
 */
Box2D.Dynamics.b2FixtureList.prototype.AddFixture = function(fixture) {
	var fixtureID = fixture.ID;
	if (this.fixtureNodeLookup[fixtureID] == null) {
		var node = new Box2D.Dynamics.b2FixtureListNode(fixture);
		var prevNode = this.fixtureLastNode;
		if (prevNode != null) {
			prevNode.SetNextNode(node);
		} else {
			this.fixtureFirstNode = node;
		}
		node.SetPreviousNode(prevNode);
		this.fixtureLastNode = node;
		this.fixtureNodeLookup[fixtureID] = node;
		this.fixtureCount++;
	}
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixture
 */
Box2D.Dynamics.b2FixtureList.prototype.RemoveFixture = function(fixture) {
	var fixtureID = fixture.ID;
	var node = this.fixtureNodeLookup[fixtureID];
	if (node == null) {
		return;
	}
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.fixtureFirstNode = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.fixtureLastNode = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
	delete this.fixtureNodeLookup[fixtureID];
	this.fixtureCount--;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2FixtureList.prototype.GetFixtureCount = function() {
	return this.fixtureCount;
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixture
 * @constructor
 */
Box2D.Dynamics.b2FixtureListNode = function(fixture) {
	
	/**
	 * @const
	 * @type {!Box2D.Dynamics.b2Fixture}
	 */
	this.fixture = fixture;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.next = null;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.previous = null;
};

/**
 * @param {Box2D.Dynamics.b2FixtureListNode} node
 */
Box2D.Dynamics.b2FixtureListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};

/**
 * @param {Box2D.Dynamics.b2FixtureListNode} node
 */
Box2D.Dynamics.b2FixtureListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};

/**
 * @return {Box2D.Dynamics.b2FixtureListNode}
 */
Box2D.Dynamics.b2FixtureListNode.prototype.GetNextNode = function() {
	return this.next;
};

/**
 * @return {Box2D.Dynamics.b2FixtureListNode}
 */
Box2D.Dynamics.b2FixtureListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};

/**
 * @param {!Box2D.Dynamics.b2ContactListener} listener
 * @param {!Box2D.Dynamics.Contacts.b2ContactSolver} contactSolver
 * @constructor
 */
Box2D.Dynamics.b2Island = function(listener, contactSolver) {
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactListener}
	 */
	this.m_listener = listener;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactSolver}
	 */
	this.m_contactSolver = contactSolver;
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2Body>}
	 */
	this.m_bodies = [];
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2Body>}
	 */
	this.m_dynamicBodies = [];
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2Body>}
	 */
	this.m_nonStaticBodies = [];
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.Contacts.b2Contact>}
	 */
	this.m_contacts = [];
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.Joints.b2Joint>}
	 */
	this.m_joints = [];
};

Box2D.Dynamics.b2Island.prototype.Clear = function() {
	this.m_bodies = [];
	this.m_dynamicBodies = [];
	this.m_nonStaticBodies = [];
	this.m_contacts = [];
	this.m_joints = [];
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 * @param {boolean} allowSleep
 */
Box2D.Dynamics.b2Island.prototype.Solve = function(step, gravity, allowSleep) {
	this._InitializeVelocities(step, gravity);
	this.m_contactSolver.Initialize(step, this.m_contacts, this.m_contacts.length);
	this._SolveVelocityConstraints(step);
	this._SolveBodies(step);
	this._SolvePositionConstraints(step);
	this.Report(this.m_contactSolver.m_constraints);
	if (allowSleep) {
		this._SleepIfTired(step);
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 * @private
 */
Box2D.Dynamics.b2Island.prototype._InitializeVelocities = function(step, gravity) {
	for (var i = 0; i < this.m_dynamicBodies.length; i++) {
		var b = this.m_dynamicBodies[i];
		b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
		b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
		b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
		b.m_linearVelocity.Multiply(Box2D.Common.Math.b2Math.Clamp(1.0 - step.dt * b.m_linearDamping, 0.0, 1.0));
		b.m_angularVelocity *= Box2D.Common.Math.b2Math.Clamp(1.0 - step.dt * b.m_angularDamping, 0.0, 1.0);
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SolveVelocityConstraints = function(step) {
	this.m_contactSolver.InitVelocityConstraints(step);
	for (var jointInitIdx = 0; jointInitIdx < this.m_joints.length; jointInitIdx++) {
		this.m_joints[jointInitIdx].InitVelocityConstraints(step);
	}
	for (var velocityIterationCnt = 0; velocityIterationCnt < step.velocityIterations; velocityIterationCnt++) {
		for (var jointSolveIdx = 0; jointSolveIdx < this.m_joints.length; jointSolveIdx++) {
			this.m_joints[jointSolveIdx].SolveVelocityConstraints(step);
		}
		this.m_contactSolver.SolveVelocityConstraints();
	}
	for (var jointFinalizeIdx = 0; jointFinalizeIdx < this.m_joints.length; jointFinalizeIdx++) {
		this.m_joints[jointFinalizeIdx].FinalizeVelocityConstraints();
	}
	this.m_contactSolver.FinalizeVelocityConstraints();
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SolveBodies = function(step) {
	for (var i = 0; i < this.m_nonStaticBodies.length; ++i) {
		var b = this.m_nonStaticBodies[i];
		var translationX = step.dt * b.m_linearVelocity.x;
		var translationY = step.dt * b.m_linearVelocity.y;
		if ((translationX * translationX + translationY * translationY) > Box2D.Common.b2Settings.b2_maxTranslationSquared) {
			b.m_linearVelocity.Normalize();
			b.m_linearVelocity.x *= Box2D.Common.b2Settings.b2_maxTranslation * step.inv_dt;
			b.m_linearVelocity.y *= Box2D.Common.b2Settings.b2_maxTranslation * step.inv_dt;
		}
		var rotation = step.dt * b.m_angularVelocity;
		if (rotation * rotation > Box2D.Common.b2Settings.b2_maxRotationSquared) {
			if (b.m_angularVelocity < 0.0) {
				b.m_angularVelocity = -Box2D.Common.b2Settings.b2_maxRotation * step.inv_dt;
			} else {
				b.m_angularVelocity = Box2D.Common.b2Settings.b2_maxRotation * step.inv_dt;
			}
		}
		b.m_sweep.c0.SetV(b.m_sweep.c);
		b.m_sweep.a0 = b.m_sweep.a;
		b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
		b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
		b.m_sweep.a += step.dt * b.m_angularVelocity;
		b.SynchronizeTransform();
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SolvePositionConstraints = function(step) {
	for (var i = 0; i < step.positionIterations; i++) {
		var contactsOkay = this.m_contactSolver.SolvePositionConstraints(Box2D.Common.b2Settings.b2_contactBaumgarte);
		var jointsOkay = true;
		for (var j = 0; j < this.m_joints.length; j++) {
			var jointOkay = this.m_joints[j].SolvePositionConstraints(Box2D.Common.b2Settings.b2_contactBaumgarte);
			jointsOkay = jointsOkay && jointOkay;
		}
		if (contactsOkay && jointsOkay) {
			break;
		}
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SleepIfTired = function(step) {
	var minSleepTime = Number.MAX_VALUE;
	for (var nonstaticBodyIdx = 0; nonstaticBodyIdx < this.m_nonStaticBodies.length; nonstaticBodyIdx++) {
		var b = this.m_nonStaticBodies[nonstaticBodyIdx];
		if (!b.m_allowSleep || Math.abs(b.m_angularVelocity) > Box2D.Common.b2Settings.b2_angularSleepTolerance || Box2D.Common.Math.b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > Box2D.Common.b2Settings.b2_linearSleepToleranceSquared) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		} else {
			b.m_sleepTime += step.dt;
			minSleepTime = Math.min(minSleepTime, b.m_sleepTime);
		}
	}
	if (minSleepTime >= Box2D.Common.b2Settings.b2_timeToSleep) {
		for (var bodyIdx = 0; bodyIdx < this.m_bodies.length; bodyIdx++) {
			this.m_bodies[bodyIdx].SetAwake(false);
		}
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} subStep
 */
Box2D.Dynamics.b2Island.prototype.SolveTOI = function(subStep) {
	var i = 0;
	var j = 0;
	this.m_contactSolver.Initialize(subStep, this.m_contacts, this.m_contacts.length);
	var contactSolver = this.m_contactSolver;
	for (i = 0; i < this.m_joints.length; ++i) {
		this.m_joints[i].InitVelocityConstraints(subStep);
	}
	for (i = 0; i < subStep.velocityIterations; ++i) {
		contactSolver.SolveVelocityConstraints();
		for (j = 0; j < this.m_joints.length; ++j) {
			this.m_joints[j].SolveVelocityConstraints(subStep);
		}
	}
	for (i = 0; i < this.m_nonStaticBodies.length; ++i) {
		var b = this.m_nonStaticBodies[i];
		var translationX = subStep.dt * b.m_linearVelocity.x;
		var translationY = subStep.dt * b.m_linearVelocity.y;
		if ((translationX * translationX + translationY * translationY) > Box2D.Common.b2Settings.b2_maxTranslationSquared) {
			b.m_linearVelocity.Normalize();
			b.m_linearVelocity.x *= Box2D.Common.b2Settings.b2_maxTranslation * subStep.inv_dt;
			b.m_linearVelocity.y *= Box2D.Common.b2Settings.b2_maxTranslation * subStep.inv_dt;
		}
		var rotation = subStep.dt * b.m_angularVelocity;
		if (rotation * rotation > Box2D.Common.b2Settings.b2_maxRotationSquared) {
			if (b.m_angularVelocity < 0.0) {
				b.m_angularVelocity = (-Box2D.Common.b2Settings.b2_maxRotation * subStep.inv_dt);
			} else {
				b.m_angularVelocity = Box2D.Common.b2Settings.b2_maxRotation * subStep.inv_dt;
			}
		}
		b.m_sweep.c0.SetV(b.m_sweep.c);
		b.m_sweep.a0 = b.m_sweep.a;
		b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
		b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
		b.m_sweep.a += subStep.dt * b.m_angularVelocity;
		b.SynchronizeTransform();
	}
	var k_toiBaumgarte = 0.75;
	for (i = 0; i < subStep.positionIterations; ++i) {
		var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte);
		var jointsOkay = true;
		for (j = 0; j < this.m_joints.length; ++j) {
			var jointOkay = this.m_joints[j].SolvePositionConstraints(Box2D.Common.b2Settings.b2_contactBaumgarte);
			jointsOkay = jointsOkay && jointOkay;
		}
		if (contactsOkay && jointsOkay) {
			break;
		}
	}
	this.Report(contactSolver.m_constraints);
};

/**
 * @param {Array.<!Box2D.Dynamics.Contacts.b2ContactConstraint>} constraints
 */
Box2D.Dynamics.b2Island.prototype.Report = function(constraints) {
	if (this.m_listener == null) {
		return;
	}
	for (var i = 0; i < this.m_contacts.length; ++i) {
		var c = this.m_contacts[i];
		var cc = constraints[i];
		var impulse = new Box2D.Dynamics.b2ContactImpulse();
		for (var j = 0; j < cc.pointCount; ++j) {
			impulse.normalImpulses[j] = cc.points[j].normalImpulse;
			impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
		}
		this.m_listener.PostSolve(c, impulse);
	}
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2Island.prototype.AddBody = function(body) {
	this.m_bodies.push(body);
	if (body.GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		this.m_nonStaticBodies.push(body);
		if (body.GetType() == Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
			this.m_dynamicBodies.push(body);
		}
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.b2Island.prototype.AddContact = function(contact) {
	this.m_contacts.push(contact);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2Joint} joint
 */
Box2D.Dynamics.b2Island.prototype.AddJoint = function(joint) {
	this.m_joints.push(joint);
};

/**
 * @param {number} dt
 * @param {number} dtRatio
 * @param {number} positionIterations
 * @param {number} velocityIterations
 * @param {boolean} warmStarting
 * @constructor
 */
Box2D.Dynamics.b2TimeStep = function(dt, dtRatio, positionIterations, velocityIterations, warmStarting) {
	/**
	 * @const
	 * @type {number}
	 */
	this.dt = dt;
	
	var invDT = 0;
	if (dt > 0) {
		invDT = 1 / dt;
	}
	
	/**
	 * @const
	 * @type {number}
	 */
	this.inv_dt = invDT;
	
	/**
	 * @const
	 * @type {number}
	 */
	this.dtRatio = dtRatio;
	
	/**
	 * @const
	 * @type {number}
	 */
	this.positionIterations = positionIterations;
	
	/**
	 * @const
	 * @type {number}
	 */
	this.velocityIterations = velocityIterations;
	
	/**
	 * @const
	 * @type {boolean}
	 */
	this.warmStarting = warmStarting;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 * @param {boolean} doSleep
 * @constructor
 */
Box2D.Dynamics.b2World = function(gravity, doSleep) {
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactManager}
	 */
	this.m_contactManager = new Box2D.Dynamics.b2ContactManager(this);

	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactSolver}
	 */
	this.m_contactSolver = new Box2D.Dynamics.Contacts.b2ContactSolver();

	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_isLocked = false;

	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_newFixture = false;

	/**
	 * @private
	 * @type {Box2D.Dynamics.b2DestructionListener}
	 */
	this.m_destructionListener = null;

	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2BodyList}
	 */
	this.bodyList = new Box2D.Dynamics.b2BodyList();
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	 this.contactList = new Box2D.Dynamics.Contacts.b2ContactList();

	/**
	 * @private
	 * @type {Box2D.Dynamics.Joints.b2Joint}
	 */
	this.m_jointList = null;

	/**
	 * @private
	 * @type {!Box2D.Dynamics.Controllers.b2ControllerList}
	 */
	this.controllerList = new Box2D.Dynamics.Controllers.b2ControllerList();
	
	/**
	 * @private
	 * @type {number}
	 */
	this.m_jointCount = 0;

	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_warmStarting = true;

	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_continuousPhysics = true;

	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_allowSleep = doSleep;

	/**
	 * @private
	 * @type {!Box2D.Common.Math.b2Vec2}
	 */
	this.m_gravity = gravity;

	/**
	 * @private
	 * @type {number}
	 */
	this.m_inv_dt0 = 0.0;

	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Body}
	 */
	this.m_groundBody = this.CreateBody(new Box2D.Dynamics.b2BodyDef());
};

/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2World.MAX_TOI = 1.0 - 100.0 * Number.MIN_VALUE;

/**
 * @param {!Box2D.Dynamics.b2DestructionListener} listener
 */
Box2D.Dynamics.b2World.prototype.SetDestructionListener = function(listener) {
	this.m_destructionListener = listener;
};

/**
 * @param {!Box2D.Dynamics.b2ContactFilter} filter
 */
Box2D.Dynamics.b2World.prototype.SetContactFilter = function(filter) {
	this.m_contactManager.m_contactFilter = filter;
};

/**
 * @param {!Box2D.Dynamics.b2ContactListener} listener
 */
Box2D.Dynamics.b2World.prototype.SetContactListener = function(listener) {
	this.m_contactManager.m_contactListener = listener;
};

/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 */
Box2D.Dynamics.b2World.prototype.SetBroadPhase = function(broadPhase) {
	var oldBroadPhase = this.m_contactManager.m_broadPhase;
	this.m_contactManager.m_broadPhase = broadPhase;
	for (var node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); node; node = node.GetNextNode()) {
		for (var fixtureNode = node.body.GetFixtureList().GetFirstNode(); fixtureNode; fixtureNode = fixtureNode.GetNextNode()) {
			var f = fixtureNode.fixture;
			f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
		}
	}
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetProxyCount = function() {
	return this.m_contactManager.m_broadPhase.GetProxyCount();
};

/**
 * @param {!Box2D.Dynamics.b2BodyDef} def
 * @return {!Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2World.prototype.CreateBody = function(def) {
	assert2(!this.IsLocked());
	var b = new Box2D.Dynamics.b2Body(def, this);
	this.bodyList.AddBody(b);
	return b;
};

/**
 * @param {!Box2D.Dynamics.b2Body} b
 */
Box2D.Dynamics.b2World.prototype.DestroyBody = function(b) {
	assert2(!this.IsLocked());
	var jn = b.m_jointList;
	while (jn) {
		var jn0 = jn;
		jn = jn.next;
		if (this.m_destructionListener) {
			this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
		}
		this.DestroyJoint(jn0.joint);
	}
	for (var node = b.GetControllerList().GetFirstNode(); node; node = node.GetNextNode()) {
		node.controller.RemoveBody(b);
	}
	for (var contactNode = b.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		this.m_contactManager.Destroy(contactNode.contact);
	}
	for (var fixtureNode = b.GetFixtureList().GetFirstNode(); fixtureNode; fixtureNode = fixtureNode.GetNextNode()) {
		// Why doesn't this happen in body.DestroyFixture?
		if (this.m_destructionListener) {
			this.m_destructionListener.SayGoodbyeFixture(fixtureNode.fixture);
		}
		b.DestroyFixture(fixtureNode.fixture);
	}
	b.Destroy();
	this.bodyList.RemoveBody(b);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2JointDef} def
 * @return {!Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.b2World.prototype.CreateJoint = function(def) {
	var j = Box2D.Dynamics.Joints.b2Joint.Create(def);
	j.m_prev = null;
	j.m_next = this.m_jointList;
	if (this.m_jointList) {
		this.m_jointList.m_prev = j;
	}
	this.m_jointList = j;
	this.m_jointCount++;
	j.m_edgeA.joint = j;
	j.m_edgeA.other = j.m_bodyB;
	j.m_edgeA.prev = null;
	j.m_edgeA.next = j.m_bodyA.m_jointList;
	if (j.m_bodyA.m_jointList) {
		j.m_bodyA.m_jointList.prev = j.m_edgeA;
	}
	j.m_bodyA.m_jointList = j.m_edgeA;
	j.m_edgeB.joint = j;
	j.m_edgeB.other = j.m_bodyA;
	j.m_edgeB.prev = null;
	j.m_edgeB.next = j.m_bodyB.m_jointList;
	if (j.m_bodyB.m_jointList) {
		j.m_bodyB.m_jointList.prev = j.m_edgeB;
	}
	j.m_bodyB.m_jointList = j.m_edgeB;
	var bodyA = def.bodyA;
	var bodyB = def.bodyB;
	if (!def.collideConnected) {
		for (var contactNode = bodyB.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
			if (contactNode.contact.GetOther(bodyB) == bodyA) {
				contactNode.contact.FlagForFiltering();
			}
		}
	}
	return j;
};

/**
 * @param {!Box2D.Dynamics.Joints.b2Joint} j
 */
Box2D.Dynamics.b2World.prototype.DestroyJoint = function(j) {
	var collideConnected = j.m_collideConnected;
	if (j.m_prev) {
		j.m_prev.m_next = j.m_next;
	}
	if (j.m_next) {
		j.m_next.m_prev = j.m_prev;
	}
	if (j == this.m_jointList) {
		this.m_jointList = j.m_next;
	}
	var bodyA = j.m_bodyA;
	var bodyB = j.m_bodyB;
	bodyA.SetAwake(true);
	bodyB.SetAwake(true);
	if (j.m_edgeA.prev) {
		j.m_edgeA.prev.next = j.m_edgeA.next;
	}
	if (j.m_edgeA.next) {
		j.m_edgeA.next.prev = j.m_edgeA.prev;
	}
	if (j.m_edgeA == bodyA.m_jointList) {
		bodyA.m_jointList = j.m_edgeA.next;
	}
	j.m_edgeA.prev = null;
	j.m_edgeA.next = null;
	if (j.m_edgeB.prev) {
		j.m_edgeB.prev.next = j.m_edgeB.next;
	}
	if (j.m_edgeB.next) {
		j.m_edgeB.next.prev = j.m_edgeB.prev;
	}
	if (j.m_edgeB == bodyB.m_jointList) {
		bodyB.m_jointList = j.m_edgeB.next;
	}
	j.m_edgeB.prev = null;
	j.m_edgeB.next = null;
	this.m_jointCount--;
	if (!collideConnected) {
		for (var contactNode = bodyB.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
			if (contactNode.contact.GetOther(bodyB) == bodyA) {
				contactNode.contact.FlagForFiltering();
			}
		}
	}
};

/**
 * @return {!Box2D.Dynamics.Controllers.b2ControllerList}
 */
Box2D.Dynamics.b2World.prototype.GetControllerList = function() {
	return this.controllerList;
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} c
 * @return {!Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.b2World.prototype.AddController = function(c) {
	if (c.m_world !== null && c.m_world != this) {
		throw new Error("Controller can only be a member of one world");
	}
	this.controllerList.AddController(c);
	c.m_world = this;
	return c;
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} c
 */
Box2D.Dynamics.b2World.prototype.RemoveController = function(c) {
	this.controllerList.RemoveController(c);
	c.m_world = null;
	c.Clear();
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 * @return {!Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.b2World.prototype.CreateController = function(controller) {
	return this.AddController(controller);
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.b2World.prototype.DestroyController = function(controller) {
	this.RemoveController(controller);
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2World.prototype.SetWarmStarting = function(flag) {
	this.m_warmStarting = flag;
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2World.prototype.SetContinuousPhysics = function(flag) {
	this.m_continuousPhysics = flag;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetBodyCount = function() {
	return this.bodyList.GetBodyCount();
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetJointCount = function() {
	return this.m_jointCount;
};

/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetContactCount = function() {
	return this.contactList.GetContactCount();
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 */
Box2D.Dynamics.b2World.prototype.SetGravity = function(gravity) {
	this.m_gravity = gravity;
};

/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Dynamics.b2World.prototype.GetGravity = function() {
	return this.m_gravity;
};

/**
 * @return {!Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2World.prototype.GetGroundBody = function() {
	return this.m_groundBody;
};

/**
 * @param {number} dt
 * @param {number} velocityIterations
 * @param {number} positionIterations
 */
Box2D.Dynamics.b2World.prototype.Step = function(dt, velocityIterations, positionIterations) {
	if (this.m_newFixture) {
		this.m_contactManager.FindNewContacts();
		this.m_newFixture = false;
	}
	this.m_isLocked = true;
	var step = new Box2D.Dynamics.b2TimeStep(dt, this.m_inv_dt0 * dt /* dtRatio */, velocityIterations, positionIterations, this.m_warmStarting);
	this.m_contactManager.Collide();
	if (step.dt > 0.0) {
		this.Solve(step);
		if (this.m_continuousPhysics) {
			this.SolveTOI(step);
		}
		this.m_inv_dt0 = step.inv_dt;
	}
	this.m_isLocked = false;
};

Box2D.Dynamics.b2World.prototype.ClearForces = function() {
	for (var node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.dynamicBodies); node; node = node.GetNextNode()) {
		node.body.m_force.SetZero();
		node.body.m_torque = 0.0;
	}
};

/**
 * @param {function(!Box2D.Dynamics.b2Fixture):boolean} callback
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Dynamics.b2World.prototype.QueryAABB = function(callback, aabb) {
	this.m_contactManager.m_broadPhase.Query(callback, aabb);
};

/**
 * @param {function(!Box2D.Dynamics.b2Fixture): boolean} callback
 * @param {!Box2D.Common.Math.b2Vec2} p
 */
Box2D.Dynamics.b2World.prototype.QueryPoint = function(callback, p) {
	/** @type {function(!Box2D.Dynamics.b2Fixture): boolean} */
	var WorldQueryWrapper = function(fixture) {
		if (fixture.TestPoint(p)) {
			return callback(fixture);
		} else {
			return true;
		}
	};
	var aabb = Box2D.Collision.b2AABB.Get();
	aabb.lowerBound_.Set(p.x - Box2D.Common.b2Settings.b2_linearSlop, p.y - Box2D.Common.b2Settings.b2_linearSlop);
	aabb.upperBound_.Set(p.x + Box2D.Common.b2Settings.b2_linearSlop, p.y + Box2D.Common.b2Settings.b2_linearSlop);
	this.m_contactManager.m_broadPhase.Query(WorldQueryWrapper, aabb);
	Box2D.Collision.b2AABB.Free(aabb);
};

/**
 * @param {function(!Box2D.Dynamics.b2Fixture, !Box2D.Common.Math.b2Vec2, !Box2D.Common.Math.b2Vec2, number): number} callback
 * @param {!Box2D.Common.Math.b2Vec2} point1
 * @param {!Box2D.Common.Math.b2Vec2} point2
 */
Box2D.Dynamics.b2World.prototype.RayCast = function(callback, point1, point2) {
	var broadPhase = this.m_contactManager.m_broadPhase;
	var output = new Box2D.Collision.b2RayCastOutput();

	/**
	 * @param {!Box2D.Collision.b2RayCastInput} input
	 * @param {!Box2D.Dynamics.b2Fixture} fixture
	 */
	var RayCastWrapper = function(input, fixture) {
			var hit = fixture.RayCast(output, input);
			if (hit) {
				var flipFrac = 1 - output.fraction;
				var point = Box2D.Common.Math.b2Vec2.Get(flipFrac * point1.x + output.fraction * point2.x, flipFrac * point1.y + output.fraction * point2.y);
				var retVal = callback(fixture, point, output.normal, output.fraction);
				Box2D.Common.Math.b2Vec2.Free(point);
				return retVal;
			} else {
				return input.maxFraction;
			}
		};
	var input = new Box2D.Collision.b2RayCastInput(point1, point2, 1 /* maxFraction */ );
	broadPhase.RayCast(RayCastWrapper, input);
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} point1
 * @param {!Box2D.Common.Math.b2Vec2} point2
 * @return {Box2D.Dynamics.b2Fixture}
 */
Box2D.Dynamics.b2World.prototype.RayCastOne = function(point1, point2) {
	var result = null;
	/**
	 * @param {!Box2D.Dynamics.b2Fixture} fixture
	 * @param {!Box2D.Common.Math.b2Vec2} point
	 * @param {!Box2D.Common.Math.b2Vec2} normal
	 * @param {number} fraction
	 * @return {number}
	 */
	var RayCastOneWrapper = function(fixture, point, normal, fraction) {
		result = fixture;
		return fraction;
	};
	this.RayCast(RayCastOneWrapper, point1, point2);
	return result;
};

/**
 * @param {!Box2D.Common.Math.b2Vec2} point1
 * @param {!Box2D.Common.Math.b2Vec2} point2
 * @return {Array.<Box2D.Dynamics.b2Fixture>}
 */
Box2D.Dynamics.b2World.prototype.RayCastAll = function(point1, point2) {
	var result = [];

	/**
	 * @param {!Box2D.Dynamics.b2Fixture} fixture
	 * @param {!Box2D.Common.Math.b2Vec2} point
	 * @param {!Box2D.Common.Math.b2Vec2} normal
	 * @param {number} fraction
	 * @return {number}
	 */
	var RayCastAllWrapper = function(fixture, point, normal, fraction) {
		result.push(fixture);
		return 1;
	};
	this.RayCast(RayCastAllWrapper, point1, point2);
	return result;
};

/**
 * @return {!Box2D.Dynamics.b2BodyList}
 */
Box2D.Dynamics.b2World.prototype.GetBodyList = function() {
	return this.bodyList;
};

/**
 * @return {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.b2World.prototype.GetJointList = function() {
	return this.m_jointList;
};

/**
 * @return {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.b2World.prototype.GetContactList = function() {
	return this.contactList;
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.b2World.prototype.IsLocked = function() {
	return this.m_isLocked;
};

// recycled for less GC
var b2solvearray = [];

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 */
Box2D.Dynamics.b2World.prototype.Solve = function(step) {
	for (var controllerNode = this.controllerList.GetFirstNode(); controllerNode; controllerNode = controllerNode.GetNextNode()) {
		controllerNode.controller.Step(step);
	}
	var m_island = new Box2D.Dynamics.b2Island(this.m_contactManager.m_contactListener, this.m_contactSolver);
	
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		bodyNode.body.m_islandFlag = false;
	}
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		contactNode.contact.m_islandFlag = false;
	}
	for (var j = this.m_jointList; j; j = j.m_next) {
		j.m_islandFlag = false;
	}
	
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var seed = bodyNode.body;
		if (seed.m_islandFlag) {
			continue;
		}
		m_island.Clear();
		b2solvearray.length = 0;
		var stack = b2solvearray;
		stack.push(seed);
		seed.m_islandFlag = true;
		while (stack.length > 0) {
			var b = stack.pop();
			m_island.AddBody(b);
			if (!b.IsAwake()) {
				b.SetAwake(true);
			}
			if (b.GetType() == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
				continue;
			}
			for (var contactNode = b.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts); contactNode; contactNode = contactNode.GetNextNode()) {
				var contact = contactNode.contact;
				if (contact.m_islandFlag) {
					continue;
				}
				m_island.AddContact(contact);
				contact.m_islandFlag = true;
				var other = contact.GetOther(b);
				if (other.m_islandFlag) {
					continue;
				}
				stack.push(other);
				other.m_islandFlag = true;
			}
			for (var jn = b.m_jointList; jn; jn = jn.next) {
				if (jn.joint.m_islandFlag || !jn.other.IsActive()) {
					continue;
				}
				m_island.AddJoint(jn.joint);
				jn.joint.m_islandFlag = true;
				if (jn.other.m_islandFlag) {
					continue;
				}
				stack.push(jn.other);
				jn.other.m_islandFlag = true;
			}
		}
		m_island.Solve(step, this.m_gravity, this.m_allowSleep);
	}
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		bodyNode.body.SynchronizeFixtures();
	}
	this.m_contactManager.FindNewContacts();
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 */
Box2D.Dynamics.b2World.prototype.SolveTOI = function(step) {
	var m_island = new Box2D.Dynamics.b2Island(this.m_contactManager.m_contactListener, this.m_contactSolver);
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var b = bodyNode.body;
		b.m_islandFlag = false;
		b.m_sweep.t0 = 0.0;
	}
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		contactNode.contact.m_islandFlag = false;
		contactNode.contact.m_toi = null;
	}
	for (var j = this.m_jointList; j; j = j.m_next) {
		j.m_islandFlag = false;
	}
	while (true) {
		var toi2 = this._SolveTOI2(step);
		var minContact = toi2.minContact;
		var minTOI = toi2.minTOI;
		if (minContact === null || Box2D.Dynamics.b2World.MAX_TOI < minTOI) {
			break;
		}
		var fixtureABody = minContact.m_fixtureA.GetBody();
		var fixtureBBody =  minContact.m_fixtureB.GetBody();
		Box2D.Dynamics.b2World.s_backupA.Set(fixtureABody.m_sweep);
		Box2D.Dynamics.b2World.s_backupB.Set(fixtureBBody.m_sweep);
		fixtureABody.Advance(minTOI);
		fixtureBBody.Advance(minTOI);
		minContact.Update(this.m_contactManager.m_contactListener);
		minContact.m_toi = null;
		if (minContact.sensor || !minContact.enabled) {
			fixtureABody.m_sweep.Set(Box2D.Dynamics.b2World.s_backupA);
			fixtureBBody.m_sweep.Set(Box2D.Dynamics.b2World.s_backupB);
			fixtureABody.SynchronizeTransform();
			fixtureBBody.SynchronizeTransform();
			continue;
		}
		if (!minContact.touching) {
			continue;
		}
		var seed = fixtureABody;
		if (seed.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
			seed = fixtureBBody;
		}
		m_island.Clear();
		b2solvearray.length = 0;
		var queue = b2solvearray;
		queue.push(seed);
		seed.m_islandFlag = true;
		while (queue.length > 0) {
			var b = queue.pop();
			m_island.AddBody(b);
			if (!b.IsAwake()) {
				b.SetAwake(true);
			}
			if (b.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
				continue;
			}
			for (var contactNode = b.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts); contactNode; contactNode = contactNode.GetNextNode()) {
				if (m_island.m_contactCount == Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland) {
					break;
				}
				var contact = contactNode.contact;
				if (contact.m_islandFlag) {
					continue;
				}
				m_island.AddContact(contact);
				contact.m_islandFlag = true;
				
				var other = contact.GetOther(b);
				if (other.m_islandFlag) {
					continue;
				}
				if (other.GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
					other.Advance(minTOI);
					other.SetAwake(true);
					queue.push(other);
				}
				other.m_islandFlag = true;
			}
			for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
				if (m_island.m_jointCount == Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland) {
					continue;
				}
				if (jEdge.joint.m_islandFlag || !jEdge.other.IsActive()) {
					continue;
				}
				m_island.AddJoint(jEdge.joint);
				jEdge.joint.m_islandFlag = true;
				if (jEdge.other.m_islandFlag) {
					continue;
				}
				if (jEdge.other.GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
					jEdge.other.Advance(minTOI);
					jEdge.other.SetAwake(true);
					queue.push(jEdge.other);
				}
				jEdge.other.m_islandFlag = true;
			}
		}
		m_island.SolveTOI(new Box2D.Dynamics.b2TimeStep((1.0 - minTOI) * step.dt /* dt */, 0 /* dtRatio */, step.velocityIterations, step.positionIterations, false /* warmStarting */));

		for (var i = 0; i < m_island.m_bodies.length; i++) {
			m_island.m_bodies[i].m_islandFlag = false;
			if (!m_island.m_bodies[i].IsAwake() || m_island.m_bodies[i].GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
				continue;
			}
			m_island.m_bodies[i].SynchronizeFixtures();
			for (var contactNode = m_island.m_bodies[i].contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
				contactNode.contact.m_toi = null;
			}
		}
		for (var i = 0; i < m_island.m_contactCount; i++) {
			m_island.m_contacts[i].m_islandFlag = false;
			m_island.m_contacts[i].m_toi = null;
		}
		for (var i = 0; i < m_island.m_jointCount; i++) {
			m_island.m_joints[i].m_islandFlag = false;
		}
		this.m_contactManager.FindNewContacts();
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @return {{minContact: Box2D.Dynamics.Contacts.b2Contact, minTOI: number}}
 */
Box2D.Dynamics.b2World.prototype._SolveTOI2 = function(step) {
	var minContact = null;
	var minTOI = 1.0;
	var contacts = 0;
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledContinuousContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		var c = contactNode.contact;
		if (this._SolveTOI2SkipContact(step, c)) {
			continue;
		}
		var toi = 1.0;
		if (c.m_toi != null) {
			toi = c.m_toi;
		} else if (c.touching) {
			toi = 1;
			c.m_toi = toi;
		} else {
			var fixtureABody = c.m_fixtureA.GetBody();
			var fixtureBBody = c.m_fixtureB.GetBody();
			var t0 = fixtureABody.m_sweep.t0;
			if (fixtureABody.m_sweep.t0 < fixtureBBody.m_sweep.t0) {
				t0 = fixtureBBody.m_sweep.t0;
				fixtureABody.m_sweep.Advance(t0);
			} else if (fixtureBBody.m_sweep.t0 < fixtureABody.m_sweep.t0) {
				t0 = fixtureABody.m_sweep.t0;
				fixtureBBody.m_sweep.Advance(t0);
			}
			toi = c.ComputeTOI(fixtureABody.m_sweep, fixtureBBody.m_sweep);
			assert2(0.0 <= toi && toi <= 1.0);
			if (toi > 0.0 && toi < 1.0) {
				toi = (1.0 - toi) * t0 + toi;
			}
			c.m_toi = toi;
		}
		if (Number.MIN_VALUE < toi && toi < minTOI) {
			minContact = c;
			minTOI = toi;
		}
	}
	return {
		minContact: minContact,
		minTOI: minTOI
	};
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {!Box2D.Dynamics.Contacts.b2Contact} c
 * @return {boolean}
 */
Box2D.Dynamics.b2World.prototype._SolveTOI2SkipContact = function(step, c) {
	var fixtureABody = c.m_fixtureA.GetBody();
	var fixtureBBody = c.m_fixtureB.GetBody();
	if ((fixtureABody.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || !fixtureABody.IsAwake()) && (fixtureBBody.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || !fixtureBBody.IsAwake())) {
		return true;
	}
	return false;
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 */
Box2D.Dynamics.Contacts.b2Contact = function(fixtureA, fixtureB) {
	
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Contact" + Box2D.Dynamics.Contacts.b2Contact.NEXT_ID++;
	
	/**
	 * @private
	 * @type {!Box2D.Collision.b2Manifold}
	 */
	this.m_manifold = new Box2D.Collision.b2Manifold();
	
	/**
	 * @private
	 * @type {!Box2D.Collision.b2Manifold}
	 */
	this.m_oldManifold = new Box2D.Collision.b2Manifold();
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.touching = false;

	var bodyA = fixtureA.GetBody();
	var bodyB = fixtureB.GetBody();
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.continuous = (bodyA.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyA.IsBullet() ||
					  (bodyB.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyB.IsBullet();
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.sensor = fixtureA.IsSensor() || fixtureB.IsSensor();
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.filtering = false;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Fixture}
	 */
	this.m_fixtureA = fixtureA;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Fixture}
	 */
	this.m_fixtureB = fixtureB;
	
	/**
	 * @private
	 * @type {boolean}
	 */
	this.enabled = true;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	this.bodyAList = bodyA.GetContactList();
	 
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	this.bodyBList = bodyB.GetContactList();
	 
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	this.worldList = bodyB.GetWorld().GetContactList();
	
	this.AddToLists();
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.Reset = function(fixtureA, fixtureB) {
	this.m_manifold.Reset();
	this.m_oldManifold.Reset();
	this.touching = false;
	var bodyA = fixtureA.GetBody();
	var bodyB = fixtureB.GetBody();
	this.continuous = (bodyA.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyA.IsBullet() ||
					  (bodyB.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyB.IsBullet();
	this.sensor = fixtureA.IsSensor() || fixtureB.IsSensor();
	this.filtering = false;
	this.m_fixtureA = fixtureA;
	this.m_fixtureB = fixtureB;
	this.enabled = true;
	this.bodyAList = bodyA.GetContactList();
	this.bodyBList = bodyB.GetContactList();
	this.worldList = bodyB.GetWorld().GetContactList();
	this.AddToLists();
};

Box2D.Dynamics.Contacts.b2Contact.prototype.AddToLists = function () {
	this.bodyAList.AddContact(this);
	this.bodyBList.AddContact(this);
	this.worldList.AddContact(this);
	this.UpdateLists();
};

Box2D.Dynamics.Contacts.b2Contact.prototype.UpdateLists = function () {
	var nonSensorEnabledTouching = false;
	var nonSensorEnabledContinuous = false;
	if (!this.IsSensor() && this.IsEnabled()) {
		if (this.IsTouching()) {
			nonSensorEnabledTouching = true;
		}
		if (this.IsContinuous()) {
			nonSensorEnabledContinuous = true;
		}
	}
	this.bodyAList.UpdateContact(this, nonSensorEnabledTouching, nonSensorEnabledContinuous);
	this.bodyBList.UpdateContact(this, nonSensorEnabledTouching, nonSensorEnabledContinuous);
	this.worldList.UpdateContact(this, nonSensorEnabledTouching, nonSensorEnabledContinuous);
};

Box2D.Dynamics.Contacts.b2Contact.prototype.RemoveFromLists = function () {
	this.bodyAList.RemoveContact(this);
	this.bodyBList.RemoveContact(this);
	this.worldList.RemoveContact(this);
};

/**
 * @return {!Box2D.Collision.b2Manifold}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetManifold = function () {
  return this.m_manifold;
};

/**
 * @param {!Box2D.Collision.b2WorldManifold} worldManifold
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetWorldManifold = function (worldManifold) {
	var bodyA = this.m_fixtureA.GetBody();
	var bodyB = this.m_fixtureB.GetBody();
	var shapeA = this.m_fixtureA.GetShape();
	var shapeB = this.m_fixtureB.GetShape();
	worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsTouching = function () {
  return this.touching;
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsContinuous = function () {
  return this.continuous;
};

/**
 * @param {boolean} sensor
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.SetSensor = function (sensor) {
   this.sensor = sensor;
   this.UpdateLists();
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsSensor = function () {
  return this.sensor;
};

/**
 * @param {boolean} flag
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.SetEnabled = function (flag) {
   this.enabled = flag;
   this.UpdateLists();
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsEnabled = function () {
   return this.enabled;
};

/**
 * @return {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetNext = function () {
  return this.m_next;
};

/**
 * @return {!Box2D.Dynamics.b2Fixture}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetFixtureA = function () {
  return this.m_fixtureA;
};

/**
 * @return {!Box2D.Dynamics.b2Fixture}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetFixtureB = function () {
  return this.m_fixtureB;
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @return {!Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetOther = function (body) {
	var bodyA = this.m_fixtureA.GetBody();
	if (bodyA != body) {
		return bodyA;
	} else {
		return this.m_fixtureB.GetBody();
	}
};

Box2D.Dynamics.Contacts.b2Contact.prototype.FlagForFiltering = function () {
   this.filtering = true;
};

Box2D.Dynamics.Contacts.b2Contact.prototype.ClearFiltering = function () {
   this.filtering = false;
};

/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsFiltering = function () {
   return this.filtering;
};

Box2D.Dynamics.Contacts.b2Contact.prototype.Update = function (listener) {
  var tManifold = this.m_oldManifold;
  this.m_oldManifold = this.m_manifold;
  this.m_manifold = tManifold;
  this.enabled = true;
  var touching = false;
  var wasTouching = this.IsTouching();
  var bodyA = this.m_fixtureA.GetBody();
  var bodyB = this.m_fixtureB.GetBody();
  var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
  if (this.sensor) {
	 if (aabbOverlap) {
		touching = Box2D.Collision.Shapes.b2Shape.TestOverlap(this.m_fixtureA.GetShape(), bodyA.GetTransform(), this.m_fixtureB.GetShape(), bodyB.GetTransform());
	 }
	 this.m_manifold.m_pointCount = 0;
  } else {
	 if (bodyA.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || bodyB.IsBullet()) {
		this.continuous = true;
	 } else {
		this.continuous = false;
	 }
	 if (aabbOverlap) {
		this.Evaluate();
		touching = this.m_manifold.m_pointCount > 0;
		for (var i = 0; i < this.m_manifold.m_pointCount; i++) {
		   var mp2 = this.m_manifold.m_points[i];
		   mp2.m_normalImpulse = 0.0;
		   mp2.m_tangentImpulse = 0.0;
		   for (var j = 0; j < this.m_oldManifold.m_pointCount; j++) {
			  var mp1 = this.m_oldManifold.m_points[j];
			  if (mp1.m_id.GetKey() == mp2.m_id.GetKey()) {
				 mp2.m_normalImpulse = mp1.m_normalImpulse;
				 mp2.m_tangentImpulse = mp1.m_tangentImpulse;
				 break;
			  }
		   }
		}
	 } else {
		this.m_manifold.m_pointCount = 0;
	 }
	 if (touching != wasTouching) {
		bodyA.SetAwake(true);
		bodyB.SetAwake(true);
	 }
  }
  this.touching = touching;
  if (touching != wasTouching) {
	 this.UpdateLists();
  }
  
  if (!wasTouching && touching) {
	 listener.BeginContact(this);
  }
  if (wasTouching && !touching) {
	 listener.EndContact(this);
  }
  if (!this.sensor) {
	 listener.PreSolve(this, this.m_oldManifold);
  }
};

Box2D.Dynamics.Contacts.b2Contact.prototype.Evaluate = function () {};

Box2D.Dynamics.Contacts.b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
  Box2D.Dynamics.Contacts.b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
  Box2D.Dynamics.Contacts.b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
  Box2D.Dynamics.Contacts.b2Contact.s_input.sweepA = sweepA;
  Box2D.Dynamics.Contacts.b2Contact.s_input.sweepB = sweepB;
  Box2D.Dynamics.Contacts.b2Contact.s_input.tolerance = Box2D.Common.b2Settings.b2_linearSlop;
  return Box2D.Collision.b2TimeOfImpact.TimeOfImpact(Box2D.Dynamics.Contacts.b2Contact.s_input);
};

Box2D.Dynamics.Contacts.b2Contact.s_input = new Box2D.Collision.b2TOIInput();

/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.Contacts.b2Contact.NEXT_ID = 0;

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2CircleContact = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2CircleContact, Box2D.Dynamics.Contacts.b2Contact);

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2CircleContact.prototype.Reset = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};

Box2D.Dynamics.Contacts.b2CircleContact.prototype.Evaluate = function() {
	Box2D.Collision.b2Collision.CollideCircles(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};


/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactConstraint = function() {
	this.localPlaneNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.normalMass = new Box2D.Common.Math.b2Mat22();
	this.K = new Box2D.Common.Math.b2Mat22();
	this.points = [];
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.points[i] = new Box2D.Dynamics.Contacts.b2ContactConstraintPoint();
	}
};

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactConstraintPoint = function() {
	  this.localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  this.rA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  this.rB = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Dynamics.Contacts.b2ContactConstraintPoint.prototype.Reset = function() {
	this.localPoint.Set(0, 0);
	this.rA.Set(0, 0);
	this.rB.Set(0, 0);
}; 

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactFactory = function() {
	
	/**
	 * @private
	 */
	this.m_registers = {};
	
	/**
	 * @private
	 * @type {Object.<Object.<Array.<!Box2D.Dynamics.b2Contact>>>}
	 */
	this.m_freeContacts = {};
	
	this.AddType(Box2D.Dynamics.Contacts.b2CircleContact, Box2D.Collision.Shapes.b2CircleShape.NAME, Box2D.Collision.Shapes.b2CircleShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2PolyAndCircleContact, Box2D.Collision.Shapes.b2PolygonShape.NAME, Box2D.Collision.Shapes.b2CircleShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2PolygonContact, Box2D.Collision.Shapes.b2PolygonShape.NAME, Box2D.Collision.Shapes.b2PolygonShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2EdgeAndCircleContact, Box2D.Collision.Shapes.b2EdgeShape.NAME, Box2D.Collision.Shapes.b2CircleShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2PolyAndEdgeContact, Box2D.Collision.Shapes.b2PolygonShape.NAME, Box2D.Collision.Shapes.b2EdgeShape.NAME);
};

Box2D.Dynamics.Contacts.b2ContactFactory.prototype.AddType = function(ctor, type1, type2) {
	this.m_freeContacts[type1] = this.m_freeContacts[type1] || {};
	this.m_freeContacts[type1][type2] = this.m_freeContacts[type1][type2] || [];
	
	this.m_registers[type1] = this.m_registers[type1] || {};
	this.m_registers[type1][type2] = new Box2D.Dynamics.Contacts.b2ContactRegister();
	this.m_registers[type1][type2].ctor = ctor;
	this.m_registers[type1][type2].primary = true;
	if (type1 != type2) {
		this.m_registers[type2] = this.m_registers[type2] || {};
		this.m_registers[type2][type1] = new Box2D.Dynamics.Contacts.b2ContactRegister();
		this.m_registers[type2][type1].ctor = ctor;
		this.m_registers[type2][type1].primary = false;
	}
};

Box2D.Dynamics.Contacts.b2ContactFactory.prototype.Create = function(fixtureA, fixtureB) {
	var type1 = fixtureA.GetShape().GetTypeName();
	var type2 = fixtureB.GetShape().GetTypeName();
	
	var reg = this.m_registers[type1][type2];
	var ctor = reg.ctor;
	if (ctor != null) {
		if (reg.primary) {
			if (this.m_freeContacts[type1][type2].length > 0) {
				var c = this.m_freeContacts[type1][type2].pop();
				c.Reset(fixtureA, fixtureB);
				return c;
			}
			return new ctor(fixtureA, fixtureB);
		} else {
			if (this.m_freeContacts[type2][type1].length > 0) {
				var c = this.m_freeContacts[type2][type1].pop();
				c.Reset(fixtureB, fixtureA);
				return c;
			}
			return new ctor(fixtureB, fixtureA);
		}
	} else {
		return null;
	}
};

Box2D.Dynamics.Contacts.b2ContactFactory.prototype.Destroy = function(contact) {
	var type1 = contact.m_fixtureA.GetShape().GetTypeName();
	var type2 = contact.m_fixtureB.GetShape().GetTypeName();
	this.m_freeContacts[type1][type2].push(contact);
};

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactList = function() {
	
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.Contacts.b2ContactListNode>}
	 */
	this.contactFirstNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
		this.contactFirstNodes[i] = null;
	}
	
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.Contacts.b2ContactListNode>}
	 */
	this.contactLastNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
		this.contactLastNodes[i] = null;
	}
	
	/**
	 * @private
	 * @type {Object.<Array.<Box2D.Dynamics.Contacts.b2ContactListNode>>}
	 */
	this.contactNodeLookup = {};
	
	/**
	 * @private
	 * @type {number}
	 */
	this.contactCount = 0;
};

/**
 * @param {number} type
 * @return {Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.GetFirstNode = function(type) {
	return this.contactFirstNodes[type];
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.AddContact = function(contact) {
	var contactID = contact.ID;
	if (this.contactNodeLookup[contactID] == null) {
		this.contactNodeLookup[contactID] = [];
		for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
			this.contactNodeLookup[contactID][i] = null;
		}
		this.CreateNode(contact, contactID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts);
		this.contactCount++;
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.UpdateContact = function(contact, nonSensorEnabledTouching, nonSensorEnabledContinuous) {
	if (nonSensorEnabledTouching) {
		this.CreateNode(contact, contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts);
	} else {
		this.RemoveNode(contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts);
	}
	if (nonSensorEnabledContinuous) {
		this.CreateNode(contact, contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledContinuousContacts);
	} else {
		this.RemoveNode(contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledContinuousContacts);
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.RemoveContact = function(contact) {
	var contactID = contact.ID;
	if (this.contactNodeLookup[contactID] != null) {
		for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
			this.RemoveNode(contactID, i);
		}
		delete this.contactNodeLookup[contactID];
		this.contactCount--;
	}
};

/**
 * @param {string} contactID
 * @param {number} type
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.RemoveNode = function(contactID, type) {
	var nodeList = this.contactNodeLookup[contactID];
	if (nodeList == null) {
		return;
	}
	var node = nodeList[type];
	if (node == null) {
		return;
	}
	nodeList[type] = null;
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.contactFirstNodes[type] = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.contactLastNodes[type] = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
	Box2D.Dynamics.Contacts.b2ContactListNode.FreeNode(node);
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 * @param {string} contactID
 * @param {number} type
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.CreateNode = function(contact, contactID, type) {
	var nodeList = this.contactNodeLookup[contactID];
	if (nodeList[type] == null) {
		nodeList[type] = Box2D.Dynamics.Contacts.b2ContactListNode.GetNode(contact);
		var prevNode = this.contactLastNodes[type];
		if (prevNode != null) {
			prevNode.SetNextNode(nodeList[type]);
			nodeList[type].SetPreviousNode(prevNode);
		} else {
			this.contactFirstNodes[type] = nodeList[type];
		}
		this.contactLastNodes[type] = nodeList[type];
	}
};

/**
 * @return {number}
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.GetContactCount = function() {
	return this.contactCount;
};

/**
 * @enum {number}
 */
Box2D.Dynamics.Contacts.b2ContactList.TYPES = {
	nonSensorEnabledTouchingContacts: 0,
	nonSensorEnabledContinuousContacts: 1,
	allContacts: 2 // Assumed to be last by above code
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactListNode = function(contact) {
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2Contact}
	 */
	this.contact = contact;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Contacts.b2ContactListNode}
	 */
	this.next = null;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Contacts.b2ContactListNode}
	 */
	this.previous = null;
};

/**
 * @private
 * @type {Array.<!Box2D.Dynamics.Contacts.b2ContactListNode>
 */
Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes = [];

/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 * @return {!Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.GetNode = function(contact) {
	if (Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes.length > 0) {
		var node = Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes.pop();
		node.next = null;
		node.previous = null;
		node.contact = contact;
		return node;
	} else {
		return new Box2D.Dynamics.Contacts.b2ContactListNode(contact);
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactListNode} node
 */
Box2D.Dynamics.Contacts.b2ContactListNode.FreeNode = function(node) {
	Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes.push(node);
};

/**
 * @param {Box2D.Dynamics.Contacts.b2ContactListNode} node
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};

/**
 * @param {Box2D.Dynamics.Contacts.b2ContactListNode} node
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};

/**
 * @return {!Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.GetContact = function() {
	return this.contact;
};

/**
 * @return {Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.GetNextNode = function() {
	return this.next;
};

/**
 * @return {Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactRegister = function () {
	this.pool = null;
	this.poolCount = 0;
};

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold = function() {
	this.m_normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_separations = [];
	this.m_points = [];
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype.Initialize = function(cc) {
	assert2(cc.pointCount > 0);
	switch (cc.type) {
		case Box2D.Collision.b2Manifold.e_circles:
			this._InitializeCircles(cc);
			break;
		case Box2D.Collision.b2Manifold.e_faceA:
			this._InitializeFaceA(cc);
			break;
		case Box2D.Collision.b2Manifold.e_faceB:
			this._InitializeFaceB(cc);
			break;
	}
};

/**
 * @private
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype._InitializeCircles = function(cc) {
	var tMat = cc.bodyA.m_xf.R;
	var tVec = cc.localPoint;
	var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tMat = cc.bodyB.m_xf.R;
	tVec = cc.points[0].localPoint;
	var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var dX = pointBX - pointAX;
	var dY = pointBY - pointAY;
	var d2 = dX * dX + dY * dY;
	if (d2 > Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
		var d = Math.sqrt(d2);
		this.m_normal.x = dX / d;
		this.m_normal.y = dY / d;
	} else {
		this.m_normal.x = 1.0;
		this.m_normal.y = 0.0;
	}
	this.m_points[0].x = 0.5 * (pointAX + pointBX);
	this.m_points[0].y = 0.5 * (pointAY + pointBY);
	this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
};

/**
 * @private
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype._InitializeFaceA = function(cc) {
	this.m_normal.x = cc.bodyA.m_xf.R.col1.x * cc.localPlaneNormal.x + cc.bodyA.m_xf.R.col2.x * cc.localPlaneNormal.y;
	this.m_normal.y = cc.bodyA.m_xf.R.col1.y * cc.localPlaneNormal.x + cc.bodyA.m_xf.R.col2.y * cc.localPlaneNormal.y;
	var planePointX = cc.bodyA.m_xf.position.x + (cc.bodyA.m_xf.R.col1.x * cc.localPoint.x + cc.bodyA.m_xf.R.col2.x * cc.localPoint.y);
	var planePointY = cc.bodyA.m_xf.position.y + (cc.bodyA.m_xf.R.col1.y * cc.localPoint.x + cc.bodyA.m_xf.R.col2.y * cc.localPoint.y);
	for (var i = 0; i < cc.pointCount; i++) {
		var clipPointX = cc.bodyB.m_xf.position.x + (cc.bodyB.m_xf.R.col1.x * cc.points[i].localPoint.x + cc.bodyB.m_xf.R.col2.x * cc.points[i].localPoint.y);
		var clipPointY = cc.bodyB.m_xf.position.y + (cc.bodyB.m_xf.R.col1.y * cc.points[i].localPoint.x + cc.bodyB.m_xf.R.col2.y * cc.points[i].localPoint.y);
		this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
		this.m_points[i].x = clipPointX;
		this.m_points[i].y = clipPointY;
	}
};

/**
 * @private
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype._InitializeFaceB = function(cc) {
	this.m_normal.x = cc.bodyB.m_xf.R.col1.x * cc.localPlaneNormal.x + cc.bodyB.m_xf.R.col2.x * cc.localPlaneNormal.y;
	this.m_normal.y = cc.bodyB.m_xf.R.col1.y * cc.localPlaneNormal.x + cc.bodyB.m_xf.R.col2.y * cc.localPlaneNormal.y;
	var planePointX = cc.bodyB.m_xf.position.x + (cc.bodyB.m_xf.R.col1.x * cc.localPoint.x + cc.bodyB.m_xf.R.col2.x * cc.localPoint.y);
	var planePointY = cc.bodyB.m_xf.position.y + (cc.bodyB.m_xf.R.col1.y * cc.localPoint.x + cc.bodyB.m_xf.R.col2.y * cc.localPoint.y);
	for (var i = 0; i < cc.pointCount; i++) {
		var clipPointX = cc.bodyA.m_xf.position.x + (cc.bodyA.m_xf.R.col1.x * cc.points[i].localPoint.x + cc.bodyA.m_xf.R.col2.x * cc.points[i].localPoint.y);
		var clipPointY = cc.bodyA.m_xf.position.y + (cc.bodyA.m_xf.R.col1.y * cc.points[i].localPoint.x + cc.bodyA.m_xf.R.col2.y * cc.points[i].localPoint.y);
		this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
		this.m_points[i].Set(clipPointX, clipPointY);
	}
	this.m_normal.x *= -1;
	this.m_normal.y *= -1;
};

/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactSolver = function() {
	
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.Contacts.b2ContactConstraint>}
	 */
	this.m_constraints = [];
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {Array.<!Box2D.Dynamics.Contacts.b2Contact>} contacts
 * @param {number} contactCount
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.Initialize = function(step, contacts, contactCount) {
	this.m_constraintCount = contactCount;
	while (this.m_constraints.length < this.m_constraintCount) {
		this.m_constraints[this.m_constraints.length] = new Box2D.Dynamics.Contacts.b2ContactConstraint();
	}
	for (var i = 0; i < contactCount; i++) {
		var contact = contacts[i];
		var fixtureA = contact.m_fixtureA;
		var fixtureB = contact.m_fixtureB;
		var shapeA = fixtureA.m_shape;
		var shapeB = fixtureB.m_shape;
		var radiusA = shapeA.m_radius;
		var radiusB = shapeB.m_radius;
		var bodyA = fixtureA.GetBody();
		var bodyB = fixtureB.GetBody();
		var manifold = contact.GetManifold();
		var friction = Box2D.Common.b2Settings.b2MixFriction(fixtureA.GetFriction(), fixtureB.GetFriction());
		var restitution = Box2D.Common.b2Settings.b2MixRestitution(fixtureA.GetRestitution(), fixtureB.GetRestitution());
		var vAX = bodyA.m_linearVelocity.x;
		var vAY = bodyA.m_linearVelocity.y;
		var vBX = bodyB.m_linearVelocity.x;
		var vBY = bodyB.m_linearVelocity.y;
		var wA = bodyA.m_angularVelocity;
		var wB = bodyB.m_angularVelocity;
		assert2(manifold.m_pointCount > 0);
		Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.Initialize(manifold, bodyA.m_xf, radiusA, bodyB.m_xf, radiusB);
		var normalX = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_normal.x;
		var normalY = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_normal.y;
		var cc = this.m_constraints[i];
		cc.bodyA = bodyA;
		cc.bodyB = bodyB;
		cc.manifold = manifold;
		cc.normal.x = normalX;
		cc.normal.y = normalY;
		cc.pointCount = manifold.m_pointCount;
		cc.friction = friction;
		cc.restitution = restitution;
		cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
		cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
		cc.localPoint.x = manifold.m_localPoint.x;
		cc.localPoint.y = manifold.m_localPoint.y;
		cc.radius = radiusA + radiusB;
		cc.type = manifold.m_type;
		for (var k = 0; k < cc.pointCount; ++k) {
			var cp = manifold.m_points[k];
			var ccp = cc.points[k];
			ccp.normalImpulse = cp.m_normalImpulse;
			ccp.tangentImpulse = cp.m_tangentImpulse;
			ccp.localPoint.SetV(cp.m_localPoint);
			var rAX = ccp.rA.x = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x;
			var rAY = ccp.rA.y = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y;
			var rBX = ccp.rB.x = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x;
			var rBY = ccp.rB.y = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y;
			var rnA = rAX * normalY - rAY * normalX;
			var rnB = rBX * normalY - rBY * normalX;
			rnA *= rnA;
			rnB *= rnB;
			var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
			ccp.normalMass = 1.0 / kNormal;
			var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
			kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
			ccp.equalizedMass = 1.0 / kEqualized;
			var tangentX = normalY;
			var tangentY = (-normalX);
			var rtA = rAX * tangentY - rAY * tangentX;
			var rtB = rBX * tangentY - rBY * tangentX;
			rtA *= rtA;
			rtB *= rtB;
			var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
			ccp.tangentMass = 1.0 / kTangent;
			ccp.velocityBias = 0.0;
			var tX = vBX + ((-wB * rBY)) - vAX - ((-wA * rAY));
			var tY = vBY + (wB * rBX) - vAY - (wA * rAX);
			var vRel = cc.normal.x * tX + cc.normal.y * tY;
			if (vRel < (-Box2D.Common.b2Settings.b2_velocityThreshold)) {
				ccp.velocityBias += (-cc.restitution * vRel);
			}
		}
		if (cc.pointCount == 2) {
			var ccp1 = cc.points[0];
			var ccp2 = cc.points[1];
			var invMassA = bodyA.m_invMass;
			var invIA = bodyA.m_invI;
			var invMassB = bodyB.m_invMass;
			var invIB = bodyB.m_invI;
			var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
			var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
			var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
			var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
			var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
			var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
			var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
			var k_maxConditionNumber = 100.0;
			if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
				cc.K.col1.Set(k11, k12);
				cc.K.col2.Set(k12, k22);
				cc.K.GetInverse(cc.normalMass);
			} else {
				cc.pointCount = 1;
			}
		}
	}
};

/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.InitVelocityConstraints = function(step) {
	for (var i = 0; i < this.m_constraintCount; ++i) {
		var c = this.m_constraints[i];
		var bodyA = c.bodyA;
		var bodyB = c.bodyB;
		var invMassA = bodyA.m_invMass;
		var invIA = bodyA.m_invI;
		var invMassB = bodyB.m_invMass;
		var invIB = bodyB.m_invI;
		var normalX = c.normal.x;
		var normalY = c.normal.y;
		var tangentX = normalY;
		var tangentY = (-normalX);
		var tX = 0;
		var j = 0;
		var tCount = 0;
		if (step.warmStarting) {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++j) {
				var ccp = c.points[j];
				ccp.normalImpulse *= step.dtRatio;
				ccp.tangentImpulse *= step.dtRatio;
				var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
				var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
				bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
				bodyA.m_linearVelocity.x -= invMassA * PX;
				bodyA.m_linearVelocity.y -= invMassA * PY;
				bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
				bodyB.m_linearVelocity.x += invMassB * PX;
				bodyB.m_linearVelocity.y += invMassB * PY;
			}
		} else {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++j) {
				var ccp2 = c.points[j];
				ccp2.normalImpulse = 0.0;
				ccp2.tangentImpulse = 0.0;
			}
		}
	}
};

Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints = function() {
	for (var i = 0; i < this.m_constraintCount; i++) {
		this.SolveVelocityConstraints_Constraint(this.m_constraints[i]);
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} c
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_Constraint = function(c) {
	var normalX = c.normal.x;
	var normalY = c.normal.y;
	for (var j = 0; j < c.pointCount; j++) {
		Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_ConstraintPoint(c, c.points[j]);
	}
	if (c.pointCount == 1) {
		var ccp = c.points[0];
		var dvX = c.bodyB.m_linearVelocity.x - (c.bodyB.m_angularVelocity * ccp.rB.y) - c.bodyA.m_linearVelocity.x + (c.bodyA.m_angularVelocity * ccp.rA.y);
		var dvY = c.bodyB.m_linearVelocity.y + (c.bodyB.m_angularVelocity * ccp.rB.x) - c.bodyA.m_linearVelocity.y - (c.bodyA.m_angularVelocity * ccp.rA.x);
		var vn = dvX * normalX + dvY * normalY;
		var newImpulse = ccp.normalImpulse - (ccp.normalMass * (vn - ccp.velocityBias));
		newImpulse = newImpulse > 0 ? newImpulse : 0.0;
		var impulseLambda = newImpulse - ccp.normalImpulse;
		var PX = impulseLambda * normalX;
		var PY = impulseLambda * normalY;
		c.bodyA.m_linearVelocity.x -= c.bodyA.m_invMass * PX;
		c.bodyA.m_linearVelocity.y -= c.bodyA.m_invMass * PY;
		c.bodyA.m_angularVelocity -= c.bodyA.m_invI * (ccp.rA.x * PY - ccp.rA.y * PX);
		c.bodyB.m_linearVelocity.x += c.bodyB.m_invMass * PX;
		c.bodyB.m_linearVelocity.y += c.bodyB.m_invMass * PY;
		c.bodyB.m_angularVelocity += c.bodyB.m_invI * (ccp.rB.x * PY - ccp.rB.y * PX);
		ccp.normalImpulse = newImpulse;
	} else {
		var cp1 = c.points[0];
		var cp2 = c.points[1];
		var aX = cp1.normalImpulse;
		var aY = cp2.normalImpulse;
		var dv1X = c.bodyB.m_linearVelocity.x - c.bodyB.m_angularVelocity * cp1.rB.y - c.bodyA.m_linearVelocity.x + c.bodyA.m_angularVelocity * cp1.rA.y;
		var dv1Y = c.bodyB.m_linearVelocity.y + c.bodyB.m_angularVelocity * cp1.rB.x - c.bodyA.m_linearVelocity.y - c.bodyA.m_angularVelocity * cp1.rA.x;
		var dv2X = c.bodyB.m_linearVelocity.x - c.bodyB.m_angularVelocity * cp2.rB.y - c.bodyA.m_linearVelocity.x + c.bodyA.m_angularVelocity * cp2.rA.y;
		var dv2Y = c.bodyB.m_linearVelocity.y + c.bodyB.m_angularVelocity * cp2.rB.x - c.bodyA.m_linearVelocity.y - c.bodyA.m_angularVelocity * cp2.rA.x;
		var bX = (dv1X * normalX + dv1Y * normalY) - cp1.velocityBias;
		var bY = (dv2X * normalX + dv2Y * normalY) - cp2.velocityBias;
		bX -= c.K.col1.x * aX + c.K.col2.x * aY;
		bY -= c.K.col1.y * aX + c.K.col2.y * aY;
		for (;;) {
			var firstX = (-(c.normalMass.col1.x * bX + c.normalMass.col2.x * bY));
			if (firstX >= 0) {
				var firstY = (-(c.normalMass.col1.y * bX + c.normalMass.col2.y * bY));
				if(firstY >= 0) {
					var dX = firstX - aX;
					var dY = firstY - aY;
					this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, firstX - aX, firstY - aY);
					cp1.normalImpulse = firstX;
					cp2.normalImpulse = firstY;
					break;
				}
			}
			var secondX = (-cp1.normalMass * bX);
			if (secondX >= 0) {
				if ((c.K.col1.y * secondX + bY) >= 0) {
					var dX = secondX - aX;
					var dY = -aY;
					this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, secondX - aX, -aY);
					cp1.normalImpulse = secondX;
					cp2.normalImpulse = 0;
					break;
				}
			}
			var secondY = (-cp2.normalMass * bY);
			if (secondY >= 0) {
				if ((c.K.col2.x * secondY + bX) >= 0) {
					this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, -aX, secondY - aY);
					cp1.normalImpulse = 0;
					cp2.normalImpulse = secondY;
					break;
				}
			}
			if (bX >= 0 && bY >= 0) {
				this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, -aX, -aY);
				cp1.normalImpulse = 0;
				cp2.normalImpulse = 0;
				break;
			}
			break;
		}
	}
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} c
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraintPoint} ccp
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_ConstraintPoint = function(c, ccp) {
	var tangentX = c.normal.y;
	var tangentY = -c.normal.x;
	var dvX = c.bodyB.m_linearVelocity.x - c.bodyB.m_angularVelocity * ccp.rB.y - c.bodyA.m_linearVelocity.x + c.bodyA.m_angularVelocity * ccp.rA.y;
	var dvY = c.bodyB.m_linearVelocity.y + c.bodyB.m_angularVelocity * ccp.rB.x - c.bodyA.m_linearVelocity.y - c.bodyA.m_angularVelocity * ccp.rA.x;
	var vt = dvX * tangentX + dvY * tangentY;
	var maxFriction = c.friction * ccp.normalImpulse;
	var newImpulse = Box2D.Common.Math.b2Math.Clamp(ccp.tangentImpulse - ccp.tangentMass * vt, -maxFriction, maxFriction);
	var impulseLambda = newImpulse - ccp.tangentImpulse;
	var PX = impulseLambda * tangentX;
	var PY = impulseLambda * tangentY;
	c.bodyA.m_linearVelocity.x -= c.bodyA.m_invMass * PX;
	c.bodyA.m_linearVelocity.y -= c.bodyA.m_invMass * PY;
	c.bodyA.m_angularVelocity -= c.bodyA.m_invI * (ccp.rA.x * PY - ccp.rA.y * PX);
	c.bodyB.m_linearVelocity.x += c.bodyB.m_invMass * PX;
	c.bodyB.m_linearVelocity.y += c.bodyB.m_invMass * PY;
	c.bodyB.m_angularVelocity += c.bodyB.m_invI * (ccp.rB.x * PY - ccp.rB.y * PX);
	ccp.tangentImpulse = newImpulse;
};

/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} c
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraintPoint} cp1
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraintPoint} cp2
 * @param {number} dX
 * @param {number} dY
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_ConstraintPointUpdate = function(c, cp1, cp2, dX, dY) {
	var P1X = dX * c.normal.x;
	var P1Y = dX * c.normal.y;
	var P2X = dY * c.normal.x;
	var P2Y = dY * c.normal.y;
	c.bodyA.m_linearVelocity.x -= c.bodyA.m_invMass * (P1X + P2X);
	c.bodyA.m_linearVelocity.y -= c.bodyA.m_invMass * (P1Y + P2Y);
	c.bodyA.m_angularVelocity -= c.bodyA.m_invI * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
	c.bodyB.m_linearVelocity.x += c.bodyB.m_invMass * (P1X + P2X);
	c.bodyB.m_linearVelocity.y += c.bodyB.m_invMass * (P1Y + P2Y);
	c.bodyB.m_angularVelocity += c.bodyB.m_invI * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
	cp1.normalImpulse = 0;
	cp2.normalImpulse = 0;
};


Box2D.Dynamics.Contacts.b2ContactSolver.prototype.FinalizeVelocityConstraints = function() {
	for (var i = 0; i < this.m_constraintCount; ++i) {
		var c = this.m_constraints[i];
		var m = c.manifold;
		for (var j = 0; j < c.pointCount; ++j) {
			var point1 = m.m_points[j];
			var point2 = c.points[j];
			point1.m_normalImpulse = point2.normalImpulse;
			point1.m_tangentImpulse = point2.tangentImpulse;
		}
	}
};

Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var minSeparation = 0.0;
	for (var i = 0; i < this.m_constraintCount; i++) {
		var c = this.m_constraints[i];
		var bodyA = c.bodyA;
		var bodyB = c.bodyB;
		var invMassA = bodyA.m_mass * bodyA.m_invMass;
		var invIA = bodyA.m_mass * bodyA.m_invI;
		var invMassB = bodyB.m_mass * bodyB.m_invMass;
		var invIB = bodyB.m_mass * bodyB.m_invI;
		Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.Initialize(c);
		var normal = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_normal;
		for (var j = 0; j < c.pointCount; j++) {
			var ccp = c.points[j];
			var point = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_points[j];
			var separation = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_separations[j];
			var rAX = point.x - bodyA.m_sweep.c.x;
			var rAY = point.y - bodyA.m_sweep.c.y;
			var rBX = point.x - bodyB.m_sweep.c.x;
			var rBY = point.y - bodyB.m_sweep.c.y;
			minSeparation = minSeparation < separation ? minSeparation : separation;
			var C = Box2D.Common.Math.b2Math.Clamp(baumgarte * (separation + Box2D.Common.b2Settings.b2_linearSlop), (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			var impulse = (-ccp.equalizedMass * C);
			var PX = impulse * normal.x;
			var PY = impulse * normal.y;
			bodyA.m_sweep.c.x -= invMassA * PX;
			bodyA.m_sweep.c.y -= invMassA * PY;
			bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
			bodyA.SynchronizeTransform();
			bodyB.m_sweep.c.x += invMassB * PX;
			bodyB.m_sweep.c.y += invMassB * PY;
			bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
			bodyB.SynchronizeTransform();
		}
	}
	return minSeparation > (-1.5 * Box2D.Common.b2Settings.b2_linearSlop);
};

Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolvePositionConstraints_NEW = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var minSeparation = 0.0;
	for (var i = 0; i < this.m_constraintCount; i++) {
		var c = this.m_constraints[i];
		var bodyA = c.bodyA;
		var bodyB = c.bodyB;
		var invMassA = bodyA.m_mass * bodyA.m_invMass;
		var invIA = bodyA.m_mass * bodyA.m_invI;
		var invMassB = bodyB.m_mass * bodyB.m_invMass;
		var invIB = bodyB.m_mass * bodyB.m_invI;
		Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.Initialize(c);
		var normal = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_normal;
		for (var j = 0; j < c.pointCount; j++) {
			var ccp = c.points[j];
			var point = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_points[j];
			var separation = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_separations[j];
			var rAX = point.x - bodyA.m_sweep.c.x;
			var rAY = point.y - bodyA.m_sweep.c.y;
			var rBX = point.x - bodyB.m_sweep.c.x;
			var rBY = point.y - bodyB.m_sweep.c.y;
			if (separation < minSeparation) {
				minSeparation = separation;
			}
			var C = 0;
			if (baumgarte != 0) {
				Box2D.Common.Math.b2Math.Clamp(baumgarte * (separation + Box2D.Common.b2Settings.b2_linearSlop), (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			}
			var impulse = (-ccp.equalizedMass * C);
			var PX = impulse * normal.x;
			var PY = impulse * normal.y;
			bodyA.m_sweep.c.x -= invMassA * PX;
			bodyA.m_sweep.c.y -= invMassA * PY;
			bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
			bodyA.SynchronizeTransform();
			bodyB.m_sweep.c.x += invMassB * PX;
			bodyB.m_sweep.c.y += invMassB * PY;
			bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
			bodyB.SynchronizeTransform();
		}
	}
	return minSeparation > (-1.5 * Box2D.Common.b2Settings.b2_linearSlop);
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2EdgeAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2EdgeAndCircleContact.prototype.Reset = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};

Box2D.Dynamics.Contacts.b2EdgeAndCircleContact.prototype.Evaluate = function() {
	var bA = this.m_fixtureA.GetBody();
	var bB = this.m_fixtureB.GetBody();
	this.b2CollideEdgeAndCircle(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};

Box2D.Dynamics.Contacts.b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function(manifold, edge, xf1, circle, xf2) {};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2PolyAndCircleContact = function(fixtureA, fixtureB) {
	assert2(fixtureA.GetShape() instanceof Box2D.Collision.Shapes.b2PolygonShape);
	assert2(fixtureB.GetShape() instanceof Box2D.Collision.Shapes.b2CircleShape);
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2PolyAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2PolyAndCircleContact.prototype.Reset = function(fixtureA, fixtureB) {
	assert2(fixtureA.GetShape() instanceof Box2D.Collision.Shapes.b2PolygonShape);
	assert2(fixtureB.GetShape() instanceof Box2D.Collision.Shapes.b2CircleShape);
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};

Box2D.Dynamics.Contacts.b2PolyAndCircleContact.prototype.Evaluate = function() {
	Box2D.Collision.b2Collision.CollidePolygonAndCircle(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = function(fixtureA, fixtureB) {
	assert2(fixtureA.GetShape() instanceof Box2D.Collision.Shapes.b2PolygonShape);
	assert2(fixtureB.GetShape() instanceof Box2D.Collision.Shapes.b2EdgeShape);
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2PolyAndEdgeContact, Box2D.Dynamics.Contacts.b2Contact);

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2PolyAndEdgeContact.prototype.Reset = function(fixtureA, fixtureB) {
	assert2(fixtureA.GetShape() instanceof Box2D.Collision.Shapes.b2PolygonShape);
	assert2(fixtureB.GetShape() instanceof Box2D.Collision.Shapes.b2EdgeShape);
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};

Box2D.Dynamics.Contacts.b2PolyAndEdgeContact.prototype.Evaluate = function() {
	this.b2CollidePolyAndEdge(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};

Box2D.Dynamics.Contacts.b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold, polygon, xf1, edge, xf2) {};

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2PolygonContact = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2PolygonContact, Box2D.Dynamics.Contacts.b2Contact);

/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2PolygonContact.prototype.Reset = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};

Box2D.Dynamics.Contacts.b2PolygonContact.prototype.Evaluate = function() {
	Box2D.Collision.b2Collision.CollidePolygons(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};

/**
 * @constructor
 */
Box2D.Dynamics.Controllers.b2Controller = function() {
	
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Controller" + Box2D.Dynamics.Controllers.b2Controller.NEXT_ID++;
	
	/**
	 * @type {Box2D.Dynamics.b2World}
	 */
	this.m_world = null;
	
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2BodyList}
	 */
	this.bodyList = new Box2D.Dynamics.b2BodyList();
};

Box2D.Dynamics.Controllers.b2Controller.prototype.Step = function(step) {};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.Controllers.b2Controller.prototype.AddBody = function(body) {
	this.bodyList.AddBody(body);
	body.AddController(this);
};

/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.Controllers.b2Controller.prototype.RemoveBody = function(body) {
	this.bodyList.RemoveBody(body);
	body.RemoveController(this);
};

Box2D.Dynamics.Controllers.b2Controller.prototype.Clear = function() {
	for (var node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); node; node = node.GetNextNode()) {
		this.RemoveBody(node.body);
	}
};

/**
 * @return {!Box2D.Dynamics.b2BodyList}
 */
Box2D.Dynamics.Controllers.b2Controller.prototype.GetBodyList = function() {
	return this.bodyList;
};

/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.Controllers.b2Controller.NEXT_ID = 0;

/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2BuoyancyController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, -1);
	this.offset = 0;
	this.density = 0;
	this.velocity = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.linearDrag = 2;
	this.angularDrag = 1;
	this.useDensity = false;
	this.useWorldGravity = true;
	this.gravity = null;
};
c2inherit(Box2D.Dynamics.Controllers.b2BuoyancyController, Box2D.Dynamics.Controllers.b2Controller);

Box2D.Dynamics.Controllers.b2BuoyancyController.prototype.Step = function(step) {
	if (this.useWorldGravity) {
		this.gravity = this.m_world.GetGravity().Copy();
	}
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		var areac = Box2D.Common.Math.b2Vec2.Get(0, 0);
		var massc = Box2D.Common.Math.b2Vec2.Get(0, 0);
		var area = 0.0;
		var mass = 0.0;
		for (var fixtureNode = body.GetFixtureList().GetFirstNode(); fixtureNode; fixtureNode = fixtureNode.GetNextNode()) {
			var sc = Box2D.Common.Math.b2Vec2.Get(0, 0);
			var sarea = fixtureNode.fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
			area += sarea;
			areac.x += sarea * sc.x;
			areac.y += sarea * sc.y;
			var shapeDensity = 0;
			if (this.useDensity) {
				shapeDensity = 1;
			} else {
				shapeDensity = 1;
			}
			mass += sarea * shapeDensity;
			massc.x += sarea * sc.x * shapeDensity;
			massc.y += sarea * sc.y * shapeDensity;
		}
		if (area < Number.MIN_VALUE) {
			continue;
		}
		areac.x /= area;
		areac.y /= area;
		massc.x /= mass;
		massc.y /= mass;
		var buoyancyForce = this.gravity.GetNegative();
		buoyancyForce.Multiply(this.density * area);
		body.ApplyForce(buoyancyForce, massc);
		var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
		dragForce.Subtract(this.velocity);
		dragForce.Multiply((-this.linearDrag * area));
		body.ApplyForce(dragForce, areac);
		body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
		Box2D.Common.Math.b2Vec2.Free(areac);
		Box2D.Common.Math.b2Vec2.Free(massc);
	}
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2ConstantAccelController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.A = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
c2inherit(Box2D.Dynamics.Controllers.b2ConstantAccelController, Box2D.Dynamics.Controllers.b2Controller);

Box2D.Dynamics.Controllers.b2ConstantAccelController.prototype.Step = function(step) {
	var smallA = Box2D.Common.Math.b2Vec2.Get(this.A.x * step.dt, this.A.y * step.dt);
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		var oldVelocity = body.GetLinearVelocity();
		body.SetLinearVelocity(Box2D.Common.Math.b2Vec2.Get(oldVelocity.x + smallA.x, oldVelocity.y + smallA.y));
	}
	Box2D.Common.Math.b2Vec2.Free(smallA);
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2ConstantForceController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.F = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
c2inherit(Box2D.Dynamics.Controllers.b2ConstantForceController, Box2D.Dynamics.Controllers.b2Controller);

Box2D.Dynamics.Controllers.b2ConstantForceController.prototype.Step = function(step) {
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		body.ApplyForce(this.F, body.GetWorldCenter());
	}
};

/**
 * @constructor
 */
Box2D.Dynamics.Controllers.b2ControllerList = function() {
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.controllerFirstNode = null;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.controllerLastNode = null;
	
	/**
	 * @private
	 * @type {Object.<Box2D.Dynamics.Controllers.b2ControllerListNode>}
	 */
	this.controllerNodeLookup = {};
	
	/**
	 * @private
	 * @type {number}
	 */
	this.controllerCount = 0;
};

/**
 * @return {Box2D.Dynamics.Controllers.b2ControllerListNode}
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.GetFirstNode = function() {
	return this.controllerFirstNode;
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.AddController = function(controller) {
	var controllerID = controller.ID;
	if (this.controllerNodeLookup[controllerID] == null) {
		var node = new Box2D.Dynamics.Controllers.b2ControllerListNode(controller);
		var prevNode = this.controllerLastNode;
		if (prevNode != null) {
			prevNode.SetNextNode(node);
		} else {
			this.controllerFirstNode = node;
		}
		node.SetPreviousNode(prevNode);
		this.controllerLastNode = node;
		this.controllerNodeLookup[controllerID] = node;
		this.controllerCount++;
	}
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.RemoveController = function(controller) {
	var controllerID = controller.ID;
	var node = this.controllerNodeLookup[controllerID];
	if (node == null) {
		return;
	}
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.controllerFirstNode = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.controllerLastNode = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
	delete this.controllerNodeLookup[controllerID];
	this.controllerCount--;
};

/**
 * @return {number}
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.GetControllerCount = function() {
	return this.controllerCount;
};

/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 * @constructor
 */
Box2D.Dynamics.Controllers.b2ControllerListNode = function(controller) {
	
	/**
	 * @const
	 * @type {!Box2D.Dynamics.Controllers.b2Controller}
	 */
	this.controller = controller;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.next = null;
	
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.previous = null;
};

/**
 * @param {Box2D.Dynamics.Controllers.b2ControllerListNode} node
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};

/**
 * @param {Box2D.Dynamics.Controllers.b2ControllerListNode} node
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};

/**
 * @return {Box2D.Dynamics.Controllers.b2ControllerListNode}
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.GetNextNode = function() {
	return this.next;
};

/**
 * @return {Box2D.Dynamics.Controllers.b2ControllerListNode}
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2GravityController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.G = 1;
	this.invSqr = true;
};
c2inherit(Box2D.Dynamics.Controllers.b2GravityController, Box2D.Dynamics.Controllers.b2Controller);

Box2D.Dynamics.Controllers.b2GravityController.prototype.Step = function(step) {
	var i = null;
	var body1 = null;
	var p1 = null;
	var mass1 = 0;
	var j = null;
	var body2 = null;
	var p2 = null;
	var dx = 0;
	var dy = 0;
	var r2 = 0;
	var f = null;
	if (this.invSqr) {
		for (var body1Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body1Node; body1Node = body1Node.GetNextNode()) {
			var body1 = body1Node.body;
			var p1 = body1.GetWorldCenter();
			var mass1 = body1.GetMass();
			for (var body2Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body2Node; body2Node = body2Node.GetNextNode()) {
				var body2 = body2Node.body;
				if ( !body1.IsAwake() && !body2.IsAwake() ) {
					continue;
				}
				var p2 = body2.GetWorldCenter();
				var dx = p2.x - p1.x;
				var dy = p2.y - p1.y;
				var r2 = dx * dx + dy * dy;
				if (r2 < Number.MIN_VALUE) {
					continue;
				}
				var f = Box2D.Common.Math.b2Vec2.Get(dx, dy);
				f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1 * body2.GetMass());
				if (body1.IsAwake()) {
					body1.ApplyForce(f, p1);
				}
				f.Multiply(-1);
				if (body2.IsAwake()) {
					body2.ApplyForce(f, p2);
				}
				Box2D.Common.Math.b2Vec2.Free(f);
			}
		}
	} else {
		for (var body1Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body1Node; body1Node = body1Node.GetNextNode()) {
			var body1 = bodyNode.body;
			var p1 = body1.GetWorldCenter();
			var mass1 = body1.GetMass();
			for (var body2Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body2Node; body2Node = body2Node.GetNextNode()) {
				var body2 = bodyNode.body;
				if ( !body1.IsAwake() && !body2.IsAwake() ) {
					continue;
				}
				var p2 = body2.GetWorldCenter();
				var dx = p2.x - p1.x;
				var dy = p2.y - p1.y;
				var r2 = dx * dx + dy * dy;
				if (r2 < Number.MIN_VALUE) {
					continue;
				}
				var f = Box2D.Common.Math.b2Vec2.Get(dx, dy);
				f.Multiply(this.G / r2 * mass1 * body2.GetMass());
				if (body1.IsAwake()) {
					body1.ApplyForce(f, p1);
				}
				f.Multiply(-1);
				if (body2.IsAwake()) {
					body2.ApplyForce(f, p2);
				}
				Box2D.Common.Math.b2Vec2.Free(f);
			}
		}
	}
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2TensorDampingController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.T = new Box2D.Common.Math.b2Mat22();
	this.maxTimestep = 0;
};
c2inherit(Box2D.Dynamics.Controllers.b2TensorDampingController, Box2D.Dynamics.Controllers.b2Controller);

/**
 * @param {number} xDamping
 * @param {number} yDamping
 */
Box2D.Dynamics.Controllers.b2TensorDampingController.prototype.SetAxisAligned = function(xDamping, yDamping) {
	this.T.col1.x = (-xDamping);
	this.T.col1.y = 0;
	this.T.col2.x = 0;
	this.T.col2.y = (-yDamping);
	if (xDamping > 0 || yDamping > 0) {
		this.maxTimestep = 1 / Math.max(xDamping, yDamping);
	} else {
		this.maxTimestep = 0;
	}
};

Box2D.Dynamics.Controllers.b2TensorDampingController.prototype.Step = function(step) {
	var timestep = step.dt;
	if (timestep <= Number.MIN_VALUE) return;
	if (timestep > this.maxTimestep && this.maxTimestep > 0) timestep = this.maxTimestep;
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		var damping = body.GetWorldVector(Box2D.Common.Math.b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity())));
		body.SetLinearVelocity(Box2D.Common.Math.b2Vec2.Get(body.GetLinearVelocity().x + damping.x * timestep, body.GetLinearVelocity().y + damping.y * timestep));
	}
};

/**
 * @param {!Box2D.Dynamics.Joints.b2JointDef} def
 * @constructor
 */
Box2D.Dynamics.Joints.b2Joint = function(def) {
	this.m_edgeA = new Box2D.Dynamics.Joints.b2JointEdge();
	this.m_edgeB = new Box2D.Dynamics.Joints.b2JointEdge();
	this.m_localCenterA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localCenterB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	assert2(def.bodyA != def.bodyB);
	this.m_type = def.type;
	this.m_prev = null;
	this.m_next = null;
	this.m_bodyA = def.bodyA;
	this.m_bodyB = def.bodyB;
	this.m_collideConnected = def.collideConnected;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetType = function() {
	return this.m_type;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetAnchorA = function() {
	return null;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetAnchorB = function() {
	return null;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return null;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return 0.0;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetBodyA = function() {
	return this.m_bodyA;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetBodyB = function() {
	return this.m_bodyB;
};

Box2D.Dynamics.Joints.b2Joint.prototype.GetNext = function() {
	return this.m_next;
};

Box2D.Dynamics.Joints.b2Joint.prototype.IsActive = function() {
	return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
};

Box2D.Dynamics.Joints.b2Joint.Create = function(def) {
	return def.Create();
};

Box2D.Dynamics.Joints.b2Joint.prototype.InitVelocityConstraints = function(step) {};

Box2D.Dynamics.Joints.b2Joint.prototype.SolveVelocityConstraints = function(step) {};

Box2D.Dynamics.Joints.b2Joint.prototype.FinalizeVelocityConstraints = function() {};

Box2D.Dynamics.Joints.b2Joint.prototype.SolvePositionConstraints = function(baumgarte) {
	return false;
};

Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0;
Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1;
Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2;
Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3;
Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4;
Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5;
Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6;
Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7;
Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8;
Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9;
Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0;
Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1;
Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2;
Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3;

/**
 * @constructor
 */
Box2D.Dynamics.Joints.b2JointDef = function () {
	this.type = Box2D.Dynamics.Joints.b2Joint.e_unknownJoint;
	this.bodyA = null;
	this.bodyB = null;
	this.collideConnected = false;
};

/**
 * @constructor
 */
Box2D.Dynamics.Joints.b2JointEdge = function () {};

/**
 * @param {!Box2D.Dynamics.Joints.b2DistanceJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2DistanceJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_u = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_length = def.length;
	this.m_frequencyHz = def.frequencyHz;
	this.m_dampingRatio = def.dampingRatio;
	this.m_impulse = 0.0;
	this.m_gamma = 0.0;
	this.m_bias = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2DistanceJoint, Box2D.Dynamics.Joints.b2Joint);

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};

/**
 * @param {number} inv_dt
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetReactionForce = function(inv_dt) {
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
};

/**
 * @param {number} inv_dt
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetReactionTorque = function(inv_dt) {
	return 0.0;
};

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetLength = function() {
	return this.m_length;
};

/**
 * @param {number} length
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SetLength = function(length) {
	this.m_length = length;
};

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetFrequency = function() {
	return this.m_frequencyHz;
};

/**
 * @param {number} hz
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SetFrequency = function(hz) {
	this.m_frequencyHz = hz;
};

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetDampingRatio = function() {
	return this.m_dampingRatio;
};

/**
 * @param {number} ratio
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SetDampingRatio = function(ratio) {
	this.m_dampingRatio = ratio;
};

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.InitVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
	if (length > Box2D.Common.b2Settings.b2_linearSlop) {
		this.m_u.Multiply(1.0 / length);
	} else {
		this.m_u.SetZero();
	}
	var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
	var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
	var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
	this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
	if (this.m_frequencyHz > 0.0) {
		var C = length - this.m_length;
		var omega = 2.0 * Math.PI * this.m_frequencyHz;
		var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
		var k = this.m_mass * omega * omega;
		this.m_gamma = step.dt * (d + step.dt * k);
		this.m_gamma = this.m_gamma != 0.0 ? 1 / this.m_gamma : 0.0;
		this.m_bias = C * step.dt * k * this.m_gamma;
		this.m_mass = invMass + this.m_gamma;
		this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
	}
	if (step.warmStarting) {
		this.m_impulse *= step.dtRatio;
		var PX = this.m_impulse * this.m_u.x;
		var PY = this.m_impulse * this.m_u.y;
		bA.m_linearVelocity.x -= bA.m_invMass * PX;
		bA.m_linearVelocity.y -= bA.m_invMass * PY;
		bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
		bB.m_linearVelocity.x += bB.m_invMass * PX;
		bB.m_linearVelocity.y += bB.m_invMass * PY;
		bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
	} else {
		this.m_impulse = 0.0;
	}
};

Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SolveVelocityConstraints = function(step) {
	var r1X = this.m_localAnchor1.x - this.m_bodyA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - this.m_bodyA.m_sweep.localCenter.y;
	var tX = (this.m_bodyA.m_xf.R.col1.x * r1X + this.m_bodyA.m_xf.R.col2.x * r1Y);
	r1Y = (this.m_bodyA.m_xf.R.col1.y * r1X + this.m_bodyA.m_xf.R.col2.y * r1Y);
	r1X = tX;
	var r2X = this.m_localAnchor2.x - this.m_bodyB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - this.m_bodyB.m_sweep.localCenter.y;
	tX = (this.m_bodyB.m_xf.R.col1.x * r2X + this.m_bodyB.m_xf.R.col2.x * r2Y);
	r2Y = (this.m_bodyB.m_xf.R.col1.y * r2X + this.m_bodyB.m_xf.R.col2.y * r2Y);
	r2X = tX;
	var v1X = this.m_bodyA.m_linearVelocity.x - this.m_bodyA.m_angularVelocity * r1Y;
	var v1Y = this.m_bodyA.m_linearVelocity.y + this.m_bodyA.m_angularVelocity * r1X;
	var v2X = this.m_bodyB.m_linearVelocity.x - this.m_bodyB.m_angularVelocity * r2Y;
	var v2Y = this.m_bodyB.m_linearVelocity.y + this.m_bodyB.m_angularVelocity * r2X;
	var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
	var impulse = -this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
	this.m_impulse += impulse;
	var PX = impulse * this.m_u.x;
	var PY = impulse * this.m_u.y;
	this.m_bodyA.m_linearVelocity.x -= this.m_bodyA.m_invMass * PX;
	this.m_bodyA.m_linearVelocity.y -= this.m_bodyA.m_invMass * PY;
	this.m_bodyA.m_angularVelocity -= this.m_bodyA.m_invI * (r1X * PY - r1Y * PX);
	this.m_bodyB.m_linearVelocity.x += this.m_bodyB.m_invMass * PX;
	this.m_bodyB.m_linearVelocity.y += this.m_bodyB.m_invMass * PY;
	this.m_bodyB.m_angularVelocity += this.m_bodyB.m_invI * (r2X * PY - r2Y * PX);
};

/**
 * @param {number} baumgarte
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (this.m_frequencyHz > 0.0) {
		return true;
	}
	var r1X = this.m_localAnchor1.x - this.m_bodyA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - this.m_bodyA.m_sweep.localCenter.y;
	var tX = (this.m_bodyA.m_xf.R.col1.x * r1X + this.m_bodyA.m_xf.R.col2.x * r1Y);
	r1Y = (this.m_bodyA.m_xf.R.col1.y * r1X + this.m_bodyA.m_xf.R.col2.y * r1Y);
	r1X = tX;
	var r2X = this.m_localAnchor2.x - this.m_bodyB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - this.m_bodyB.m_sweep.localCenter.y;
	tX = (this.m_bodyB.m_xf.R.col1.x * r2X + this.m_bodyB.m_xf.R.col2.x * r2Y);
	r2Y = (this.m_bodyB.m_xf.R.col1.y * r2X + this.m_bodyB.m_xf.R.col2.y * r2Y);
	r2X = tX;
	var dX = this.m_bodyB.m_sweep.c.x + r2X - this.m_bodyA.m_sweep.c.x - r1X;
	var dY = this.m_bodyB.m_sweep.c.y + r2Y - this.m_bodyA.m_sweep.c.y - r1Y;
	var length = Math.sqrt(dX * dX + dY * dY);
	dX /= length;
	dY /= length;
	var C = Box2D.Common.Math.b2Math.Clamp(length - this.m_length, -Box2D.Common.b2Settings.b2_maxLinearCorrection, Box2D.Common.b2Settings.b2_maxLinearCorrection);
	var impulse = -this.m_mass * C;
	this.m_u.Set(dX, dY);
	var PX = impulse * this.m_u.x;
	var PY = impulse * this.m_u.y;
	this.m_bodyA.m_sweep.c.x -= this.m_bodyA.m_invMass * PX;
	this.m_bodyA.m_sweep.c.y -= this.m_bodyA.m_invMass * PY;
	this.m_bodyA.m_sweep.a -= this.m_bodyA.m_invI * (r1X * PY - r1Y * PX);
	this.m_bodyB.m_sweep.c.x += this.m_bodyB.m_invMass * PX;
	this.m_bodyB.m_sweep.c.y += this.m_bodyB.m_invMass * PY;
	this.m_bodyB.m_sweep.a += this.m_bodyB.m_invI * (r2X * PY - r2Y * PX);
	this.m_bodyA.SynchronizeTransform();
	this.m_bodyB.SynchronizeTransform();
	return Math.abs(C) < Box2D.Common.b2Settings.b2_linearSlop;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2DistanceJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_distanceJoint;
	this.length = 1.0;
	this.frequencyHz = 0.0;
	this.dampingRatio = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2DistanceJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2DistanceJointDef.prototype.Initialize = function(bA, bB, anchorA, anchorB) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
	this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
	var dX = anchorB.x - anchorA.x;
	var dY = anchorB.y - anchorA.y;
	this.length = Math.sqrt(dX * dX + dY * dY);
	this.frequencyHz = 0.0;
	this.dampingRatio = 0.0;
};

Box2D.Dynamics.Joints.b2DistanceJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2DistanceJoint(this);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2FrictionJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2FrictionJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_linearMass = new Box2D.Common.Math.b2Mat22();
	this.m_linearImpulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchorA.SetV(def.localAnchorA);
	this.m_localAnchorB.SetV(def.localAnchorB);
	this.m_linearMass.SetZero();
	this.m_angularMass = 0.0;
	this.m_linearImpulse.SetZero();
	this.m_angularImpulse = 0.0;
	this.m_maxForce = def.maxForce;
	this.m_maxTorque = def.maxTorque;
};
c2inherit(Box2D.Dynamics.Joints.b2FrictionJoint, Box2D.Dynamics.Joints.b2Joint);

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_angularImpulse;
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SetMaxForce = function(force) {
	if (force === undefined) force = 0;
	this.m_maxForce = force;
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetMaxForce = function() {
	return this.m_maxForce;
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SetMaxTorque = function(torque) {
	if (torque === undefined) torque = 0;
	this.m_maxTorque = torque;
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetMaxTorque = function() {
	return this.m_maxTorque;
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.InitVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	var K = new Box2D.Common.Math.b2Mat22();
	K.col1.x = mA + mB;
	K.col2.x = 0.0;
	K.col1.y = 0.0;
	K.col2.y = mA + mB;
	K.col1.x += iA * rAY * rAY;
	K.col2.x += (-iA * rAX * rAY);
	K.col1.y += (-iA * rAX * rAY);
	K.col2.y += iA * rAX * rAX;
	K.col1.x += iB * rBY * rBY;
	K.col2.x += (-iB * rBX * rBY);
	K.col1.y += (-iB * rBX * rBY);
	K.col2.y += iB * rBX * rBX;
	K.GetInverse(this.m_linearMass);
	this.m_angularMass = iA + iB;
	if (this.m_angularMass > 0.0) {
		this.m_angularMass = 1.0 / this.m_angularMass;
	}
	if (step.warmStarting) {
		this.m_linearImpulse.x *= step.dtRatio;
		this.m_linearImpulse.y *= step.dtRatio;
		this.m_angularImpulse *= step.dtRatio;
		var P = this.m_linearImpulse;
		bA.m_linearVelocity.x -= mA * P.x;
		bA.m_linearVelocity.y -= mA * P.y;
		bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
		bB.m_linearVelocity.x += mB * P.x;
		bB.m_linearVelocity.y += mB * P.y;
		bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
	} else {
		this.m_linearImpulse.SetZero();
		this.m_angularImpulse = 0.0;
	}
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SolveVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var vA = bA.m_linearVelocity;
	var wA = bA.m_angularVelocity;
	var vB = bB.m_linearVelocity;
	var wB = bB.m_angularVelocity;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var maxImpulse = 0;
	var Cdot = wB - wA;
	var impulse = (-this.m_angularMass * Cdot);
	var oldImpulse = this.m_angularImpulse;
	maxImpulse = step.dt * this.m_maxTorque;
	this.m_angularImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
	impulse = this.m_angularImpulse - oldImpulse;
	wA -= iA * impulse;
	wB += iB * impulse;
	
	var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
	var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
	var impulseV = Box2D.Common.Math.b2Math.MulMV(this.m_linearMass, Box2D.Common.Math.b2Vec2.Get((-CdotX), (-CdotY)));
	var oldImpulseV = this.m_linearImpulse.Copy();
	this.m_linearImpulse.Add(impulseV);
	maxImpulse = step.dt * this.m_maxForce;
	if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
		this.m_linearImpulse.Normalize();
		this.m_linearImpulse.Multiply(maxImpulse);
	}
	impulseV = Box2D.Common.Math.b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
	vA.x -= mA * impulseV.x;
	vA.y -= mA * impulseV.y;
	wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
	vB.x += mB * impulseV.x;
	vB.y += mB * impulseV.y;
	wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
	
	bA.m_angularVelocity = wA;
	bB.m_angularVelocity = wB;
};

Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	return true;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2FrictionJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_frictionJoint;
	this.maxForce = 0.0;
	this.maxTorque = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2FrictionJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
	this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
};

Box2D.Dynamics.Joints.b2FrictionJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2FrictionJoint(this);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2GearJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2GearJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_groundAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_groundAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_J = new Box2D.Dynamics.Joints.b2Jacobian();
	var type1 = def.joint1.m_type;
	var type2 = def.joint2.m_type;
	this.m_revolute1 = null;
	this.m_prismatic1 = null;
	this.m_revolute2 = null;
	this.m_prismatic2 = null;
	var coordinate1 = 0;
	var coordinate2 = 0;
	this.m_ground1 = def.joint1.GetBodyA();
	this.m_bodyA = def.joint1.GetBodyB();
	if (type1 == Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint) {
		this.m_revolute1 = def.joint1;
		this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
		this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
		coordinate1 = this.m_revolute1.GetJointAngle();
	} else {
		this.m_prismatic1 = def.joint1;
		this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
		this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
		coordinate1 = this.m_prismatic1.GetJointTranslation();
	}
	this.m_ground2 = def.joint2.GetBodyA();
	this.m_bodyB = def.joint2.GetBodyB();
	if (type2 == Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint) {
		this.m_revolute2 = def.joint2;
		this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
		this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
		coordinate2 = this.m_revolute2.GetJointAngle();
	} else {
		this.m_prismatic2 = def.joint2;
		this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
		this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
		coordinate2 = this.m_prismatic2.GetJointTranslation();
	}
	this.m_ratio = def.ratio;
	this.m_constant = coordinate1 + this.m_ratio * coordinate2;
	this.m_impulse = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2GearJoint, Box2D.Dynamics.Joints.b2Joint);

Box2D.Dynamics.Joints.b2GearJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse * this.m_J.linearB.x, inv_dt * this.m_impulse * this.m_J.linearB.y);
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	var tMat = this.m_bodyB.m_xf.R;
	var rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x;
	var rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y;
	var tX = tMat.col1.x * rX + tMat.col2.x * rY;
	rY = tMat.col1.y * rX + tMat.col2.y * rY;
	rX = tX;
	var PX = this.m_impulse * this.m_J.linearB.x;
	var PY = this.m_impulse * this.m_J.linearB.y;
	return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.GetRatio = function() {
	return this.m_ratio;
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.SetRatio = function(ratio) {
	if (ratio === undefined) ratio = 0;
	this.m_ratio = ratio;
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.InitVelocityConstraints = function(step) {
	var g1 = this.m_ground1;
	var g2 = this.m_ground2;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var ugX = 0;
	var ugY = 0;
	var rX = 0;
	var rY = 0;
	var tMat;
	var tVec;
	var crug = 0;
	var tX = 0;
	var K = 0.0;
	this.m_J.SetZero();
	if (this.m_revolute1) {
		this.m_J.angularA = (-1.0);
		K += bA.m_invI;
	} else {
		tMat = g1.m_xf.R;
		tVec = this.m_prismatic1.m_localXAxis1;
		ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tMat = bA.m_xf.R;
		rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = tMat.col1.x * rX + tMat.col2.x * rY;
		rY = tMat.col1.y * rX + tMat.col2.y * rY;
		rX = tX;
		crug = rX * ugY - rY * ugX;
		this.m_J.linearA.Set((-ugX), (-ugY));
		this.m_J.angularA = (-crug);
		K += bA.m_invMass + bA.m_invI * crug * crug;
	}
	if (this.m_revolute2) {
		this.m_J.angularB = (-this.m_ratio);
		K += this.m_ratio * this.m_ratio * bB.m_invI;
	} else {
		tMat = g2.m_xf.R;
		tVec = this.m_prismatic2.m_localXAxis1;
		ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tMat = bB.m_xf.R;
		rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = tMat.col1.x * rX + tMat.col2.x * rY;
		rY = tMat.col1.y * rX + tMat.col2.y * rY;
		rX = tX;
		crug = rX * ugY - rY * ugX;
		this.m_J.linearB.Set((-this.m_ratio * ugX), (-this.m_ratio * ugY));
		this.m_J.angularB = (-this.m_ratio * crug);
		K += this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
	}
	this.m_mass = K > 0.0 ? 1.0 / K : 0.0;
	if (step.warmStarting) {
		bA.m_linearVelocity.x += bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
		bA.m_linearVelocity.y += bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
		bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
		bB.m_linearVelocity.x += bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
		bB.m_linearVelocity.y += bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
		bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
	} else {
		this.m_impulse = 0.0;
	}
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var Cdot = this.m_J.Compute(bA.m_linearVelocity, bA.m_angularVelocity, bB.m_linearVelocity, bB.m_angularVelocity);
	var impulse = (-this.m_mass * Cdot);
	this.m_impulse += impulse;
	bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
	bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
	bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
	bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
	bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
	bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
};

Box2D.Dynamics.Joints.b2GearJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var linearError = 0.0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var coordinate1 = 0;
	var coordinate2 = 0;
	if (this.m_revolute1) {
		coordinate1 = this.m_revolute1.GetJointAngle();
	} else {
		coordinate1 = this.m_prismatic1.GetJointTranslation();
	}
	if (this.m_revolute2) {
		coordinate2 = this.m_revolute2.GetJointAngle();
	} else {
		coordinate2 = this.m_prismatic2.GetJointTranslation();
	}
	var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
	var impulse = (-this.m_mass * C);
	bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
	bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
	bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
	bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
	bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
	bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return linearError < Box2D.Common.b2Settings.b2_linearSlop;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
 Box2D.Dynamics.Joints.b2GearJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_gearJoint;
	this.joint1 = null;
	this.joint2 = null;
	this.ratio = 1.0;
};
c2inherit(Box2D.Dynamics.Joints.b2GearJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2GearJointDef.prototype.Initialize = function(joint1, joint2, ratio) {
	this.joint1 = joint1;
	this.bodyA = joint1.GetBodyA();
	this.joint2 = joint2;
	this.bodyB = joint2.GetBodyA();
	this.ratio = ratio;
};

Box2D.Dynamics.Joints.b2GearJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2GearJoint(this);
};

/**
 * @constructor
 */
Box2D.Dynamics.Joints.b2Jacobian = function() {
	this.linearA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.linearB = Box2D.Common.Math.b2Vec2.Get(0, 0);
};

Box2D.Dynamics.Joints.b2Jacobian.prototype.SetZero = function() {
	this.linearA.SetZero();
	this.angularA = 0.0;
	this.linearB.SetZero();
	this.angularB = 0.0;
};

Box2D.Dynamics.Joints.b2Jacobian.prototype.Set = function(x1, a1, x2, a2) {
	if (a1 === undefined) a1 = 0;
	if (a2 === undefined) a2 = 0;
	this.linearA.SetV(x1);
	this.angularA = a1;
	this.linearB.SetV(x2);
	this.angularB = a2;
};

Box2D.Dynamics.Joints.b2Jacobian.prototype.Compute = function(x1, a1, x2, a2) {
	if (a1 === undefined) a1 = 0;
	if (a2 === undefined) a2 = 0;
	return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
};

/**
 * @param {!Box2D.Dynamics.Joints.b2LineJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2LineJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localXAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localYAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_axis = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_perp = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_K = new Box2D.Common.Math.b2Mat22();
	this.m_impulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var tMat;
	var tX = 0;
	var tY = 0;
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_localXAxis1.SetV(def.localAxisA);
	this.m_localYAxis1.x = (-this.m_localXAxis1.y);
	this.m_localYAxis1.y = this.m_localXAxis1.x;
	this.m_impulse.SetZero();
	this.m_motorMass = 0.0;
	this.m_motorImpulse = 0.0;
	this.m_lowerTranslation = def.lowerTranslation;
	this.m_upperTranslation = def.upperTranslation;
	this.m_maxMotorForce = def.maxMotorForce;
	this.m_motorSpeed = def.motorSpeed;
	this.m_enableLimit = def.enableLimit;
	this.m_enableMotor = def.enableMotor;
	this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	this.m_axis.SetZero();
	this.m_perp.SetZero();
};
c2inherit(Box2D.Dynamics.Joints.b2LineJoint, Box2D.Dynamics.Joints.b2Joint);

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_impulse.y;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetJointTranslation = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var p1 = bA.GetWorldPoint(this.m_localAnchor1);
	var p2 = bB.GetWorldPoint(this.m_localAnchor2);
	var dX = p2.x - p1.x;
	var dY = p2.y - p1.y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var translation = axis.x * dX + axis.y * dY;
	return translation;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetJointSpeed = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var p1X = bA.m_sweep.c.x + r1X;
	var p1Y = bA.m_sweep.c.y + r1Y;
	var p2X = bB.m_sweep.c.x + r2X;
	var p2Y = bB.m_sweep.c.y + r2Y;
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var v1 = bA.m_linearVelocity;
	var v2 = bB.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var w2 = bB.m_angularVelocity;
	var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
	return speed;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.IsLimitEnabled = function() {
	return this.m_enableLimit;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.EnableLimit = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableLimit = flag;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetLowerLimit = function() {
	return this.m_lowerTranslation;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetUpperLimit = function() {
	return this.m_upperTranslation;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.SetLimits = function(lower, upper) {
	if (lower === undefined) lower = 0;
	if (upper === undefined) upper = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_lowerTranslation = lower;
	this.m_upperTranslation = upper;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.IsMotorEnabled = function() {
	return this.m_enableMotor;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.EnableMotor = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableMotor = flag;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.SetMotorSpeed = function(speed) {
	if (speed === undefined) speed = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_motorSpeed = speed;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetMotorSpeed = function() {
	return this.m_motorSpeed;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.SetMaxMotorForce = function(force) {
	if (force === undefined) force = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_maxMotorForce = force;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetMaxMotorForce = function() {
	return this.m_maxMotorForce;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.GetMotorForce = function() {
	return this.m_motorImpulse;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	this.m_localCenterA.SetV(bA.GetLocalCenter());
	this.m_localCenterB.SetV(bB.GetLocalCenter());
	var xf1 = bA.GetTransform();
	var xf2 = bB.GetTransform();
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	this.m_invMassA = bA.m_invMass;
	this.m_invMassB = bB.m_invMass;
	this.m_invIA = bA.m_invI;
	this.m_invIB = bB.m_invI;
	
	this.m_axis.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localXAxis1));
	this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
	this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
	this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
	this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1.0 / this.m_motorMass : 0.0;
	
	this.m_perp.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localYAxis1));
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var m1 = this.m_invMassA;
	var m2 = this.m_invMassB;
	var i1 = this.m_invIA;
	var i2 = this.m_invIB;
	this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
	this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
	this.m_K.col2.x = this.m_K.col1.y;
	this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
	
	if (this.m_enableLimit) {
		var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_equalLimits;
		} else if (jointTransition <= this.m_lowerTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit;
				this.m_impulse.y = 0.0;
			}
		} else if (jointTransition >= this.m_upperTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
				this.m_impulse.y = 0.0;
			}
		} else {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
			this.m_impulse.y = 0.0;
		}
	} else {
		this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	}
	if (this.m_enableMotor == false) {
		this.m_motorImpulse = 0.0;
	}
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_motorImpulse *= step.dtRatio;
		var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
		var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
		var L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
		var L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
		bA.m_linearVelocity.x -= this.m_invMassA * PX;
		bA.m_linearVelocity.y -= this.m_invMassA * PY;
		bA.m_angularVelocity -= this.m_invIA * L1;
		bB.m_linearVelocity.x += this.m_invMassB * PX;
		bB.m_linearVelocity.y += this.m_invMassB * PY;
		bB.m_angularVelocity += this.m_invIB * L2;
	} else {
		this.m_impulse.SetZero();
		this.m_motorImpulse = 0.0;
	}
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var v1 = bA.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var v2 = bB.m_linearVelocity;
	var w2 = bB.m_angularVelocity;
	var PX = 0;
	var PY = 0;
	var L1 = 0;
	var L2 = 0;
	if (this.m_enableMotor && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
		var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
		var oldImpulse = this.m_motorImpulse;
		var maxImpulse = step.dt * this.m_maxMotorForce;
		this.m_motorImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
		impulse = this.m_motorImpulse - oldImpulse;
		PX = impulse * this.m_axis.x;
		PY = impulse * this.m_axis.y;
		L1 = impulse * this.m_a1;
		L2 = impulse * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var f1 = this.m_impulse.Copy();
		var df = this.m_K.Solve(Box2D.Common.Math.b2Vec2.Get(0, 0), (-Cdot1), (-Cdot2));
		this.m_impulse.Add(df);
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			this.m_impulse.y = Math.max(this.m_impulse.y, 0.0);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			this.m_impulse.y = Math.min(this.m_impulse.y, 0.0);
		}
		var b = (-Cdot1) - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
		var f2r = 0;
		if (this.m_K.col1.x != 0.0) {
			f2r = b / this.m_K.col1.x + f1.x;
		} else {
			f2r = f1.x;
		}
		this.m_impulse.x = f2r;
		df.x = this.m_impulse.x - f1.x;
		df.y = this.m_impulse.y - f1.y;
		PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
		PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
		L1 = df.x * this.m_s1 + df.y * this.m_a1;
		L2 = df.x * this.m_s2 + df.y * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	} else {
		var df2 = 0;
		if (this.m_K.col1.x != 0.0) {
			df2 = ((-Cdot1)) / this.m_K.col1.x;
		} else {
			df2 = 0.0;
		}
		this.m_impulse.x += df2;
		PX = df2 * this.m_perp.x;
		PY = df2 * this.m_perp.y;
		L1 = df2 * this.m_s1;
		L2 = df2 * this.m_s2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	bA.m_linearVelocity.SetV(v1);
	bA.m_angularVelocity = w1;
	bB.m_linearVelocity.SetV(v2);
	bB.m_angularVelocity = w2;
};

Box2D.Dynamics.Joints.b2LineJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var limitC = 0;
	var oldLimitImpulse = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var c1 = bA.m_sweep.c;
	var a1 = bA.m_sweep.a;
	var c2 = bB.m_sweep.c;
	var a2 = bB.m_sweep.a;
	var tMat;
	var tX = 0;
	var m1 = 0;
	var m2 = 0;
	var i1 = 0;
	var i2 = 0;
	var linearError = 0.0;
	var angularError = 0.0;
	var active = false;
	var C2 = 0.0;
	var R1 = Box2D.Common.Math.b2Mat22.FromAngle(a1);
	var R2 = Box2D.Common.Math.b2Mat22.FromAngle(a2);
	tMat = R1;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = R2;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = c2.x + r2X - c1.x - r1X;
	var dY = c2.y + r2Y - c1.y - r1Y;
	if (this.m_enableLimit) {
		this.m_axis = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localXAxis1);
		this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
		this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
		var translation = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = Math.abs(translation);
			active = true;
		} else if (translation <= this.m_lowerTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_lowerTranslation + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			linearError = this.m_lowerTranslation - translation;
			active = true;
		} else if (translation >= this.m_upperTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_upperTranslation + Box2D.Common.b2Settings.b2_linearSlop, 0.0, Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = translation - this.m_upperTranslation;
			active = true;
		}
	}
	this.m_perp = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localYAxis1);
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var impulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
	linearError = Math.max(linearError, Math.abs(C1));
	angularError = 0.0;
	if (active) {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
		this.m_K.col2.x = this.m_K.col1.y;
		this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
		this.m_K.Solve(impulse, (-C1), (-C2));
	} else {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		var impulse1 = 0;
		if (k11 != 0.0) {
			impulse1 = ((-C1)) / k11;
		} else {
			impulse1 = 0.0;
		}
		impulse.x = impulse1;
		impulse.y = 0.0;
	}
	var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
	var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
	var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
	var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
	c1.x -= this.m_invMassA * PX;
	c1.y -= this.m_invMassA * PY;
	a1 -= this.m_invIA * L1;
	c2.x += this.m_invMassB * PX;
	c2.y += this.m_invMassB * PY;
	a2 += this.m_invIB * L2;
	bA.m_sweep.a = a1;
	bB.m_sweep.a = a2;
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return linearError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2LineJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAxisA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_lineJoint;
	this.localAxisA.Set(1.0, 0.0);
	this.enableLimit = false;
	this.lowerTranslation = 0.0;
	this.upperTranslation = 0.0;
	this.enableMotor = false;
	this.maxMotorForce = 0.0;
	this.motorSpeed = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2LineJointDef, Box2D.Dynamics.Joints.b2JointDef);


Box2D.Dynamics.Joints.b2LineJointDef.prototype.Initialize = function(bA, bB, anchor, axis) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
	this.localAxisA = this.bodyA.GetLocalVector(axis);
};

Box2D.Dynamics.Joints.b2LineJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2LineJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2PrismaticJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2PrismaticJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localXAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localYAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_axis = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_perp = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_K = new Box2D.Common.Math.b2Mat33();
	this.m_impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_localXAxis1.SetV(def.localAxisA);
	this.m_localYAxis1.x = (-this.m_localXAxis1.y);
	this.m_localYAxis1.y = this.m_localXAxis1.x;
	this.m_refAngle = def.referenceAngle;
	this.m_impulse.SetZero();
	this.m_motorMass = 0.0;
	this.m_motorImpulse = 0.0;
	this.m_lowerTranslation = def.lowerTranslation;
	this.m_upperTranslation = def.upperTranslation;
	this.m_maxMotorForce = def.maxMotorForce;
	this.m_motorSpeed = def.motorSpeed;
	this.m_enableLimit = def.enableLimit;
	this.m_enableMotor = def.enableMotor;
	this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	this.m_axis.SetZero();
	this.m_perp.SetZero();
};
c2inherit(Box2D.Dynamics.Joints.b2PrismaticJoint, Box2D.Dynamics.Joints.b2Joint);

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_impulse.y;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetJointTranslation = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var p1 = bA.GetWorldPoint(this.m_localAnchor1);
	var p2 = bB.GetWorldPoint(this.m_localAnchor2);
	var dX = p2.x - p1.x;
	var dY = p2.y - p1.y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var translation = axis.x * dX + axis.y * dY;
	return translation;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetJointSpeed = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var p1X = bA.m_sweep.c.x + r1X;
	var p1Y = bA.m_sweep.c.y + r1Y;
	var p2X = bB.m_sweep.c.x + r2X;
	var p2Y = bB.m_sweep.c.y + r2Y;
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var v1 = bA.m_linearVelocity;
	var v2 = bB.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var w2 = bB.m_angularVelocity;
	var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
	return speed;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.IsLimitEnabled = function() {
	return this.m_enableLimit;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.EnableLimit = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableLimit = flag;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetLowerLimit = function() {
	return this.m_lowerTranslation;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetUpperLimit = function() {
	return this.m_upperTranslation;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SetLimits = function(lower, upper) {
	if (lower === undefined) lower = 0;
	if (upper === undefined) upper = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_lowerTranslation = lower;
	this.m_upperTranslation = upper;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.IsMotorEnabled = function() {
	return this.m_enableMotor;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.EnableMotor = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableMotor = flag;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SetMotorSpeed = function(speed) {
	if (speed === undefined) speed = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_motorSpeed = speed;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetMotorSpeed = function() {
	return this.m_motorSpeed;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SetMaxMotorForce = function(force) {
	if (force === undefined) force = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_maxMotorForce = force;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetMotorForce = function() {
	return this.m_motorImpulse;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	this.m_localCenterA.SetV(bA.GetLocalCenter());
	this.m_localCenterB.SetV(bB.GetLocalCenter());
	var xf1 = bA.GetTransform();
	var xf2 = bB.GetTransform();
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	this.m_invMassA = bA.m_invMass;
	this.m_invMassB = bB.m_invMass;
	this.m_invIA = bA.m_invI;
	this.m_invIB = bB.m_invI;

	this.m_axis.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localXAxis1));
	this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
	this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
	this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
	if (this.m_motorMass > Number.MIN_VALUE) this.m_motorMass = 1.0 / this.m_motorMass;

	this.m_perp.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localYAxis1));
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var m1 = this.m_invMassA;
	var m2 = this.m_invMassB;
	var i1 = this.m_invIA;
	var i2 = this.m_invIB;
	this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
	this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
	this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
	this.m_K.col2.x = this.m_K.col1.y;
	this.m_K.col2.y = i1 + i2;
	this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
	this.m_K.col3.x = this.m_K.col1.z;
	this.m_K.col3.y = this.m_K.col2.z;
	this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;

	if (this.m_enableLimit) {
		var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_equalLimits;
		} else if (jointTransition <= this.m_lowerTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit;
				this.m_impulse.z = 0.0;
			}
		} else if (jointTransition >= this.m_upperTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
				this.m_impulse.z = 0.0;
			}
		} else {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
			this.m_impulse.z = 0.0;
		}
	} else {
		this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	}
	if (this.m_enableMotor == false) {
		this.m_motorImpulse = 0.0;
	}
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_motorImpulse *= step.dtRatio;
		var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x;
		var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y;
		var L1 = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
		var L2 = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
		bA.m_linearVelocity.x -= this.m_invMassA * PX;
		bA.m_linearVelocity.y -= this.m_invMassA * PY;
		bA.m_angularVelocity -= this.m_invIA * L1;
		bB.m_linearVelocity.x += this.m_invMassB * PX;
		bB.m_linearVelocity.y += this.m_invMassB * PY;
		bB.m_angularVelocity += this.m_invIB * L2;
	} else {
		this.m_impulse.SetZero();
		this.m_motorImpulse = 0.0;
	}
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var v1 = bA.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var v2 = bB.m_linearVelocity;
	var w2 = bB.m_angularVelocity;
	var PX = 0;
	var PY = 0;
	var L1 = 0;
	var L2 = 0;
	if (this.m_enableMotor && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
		var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
		var oldImpulse = this.m_motorImpulse;
		var maxImpulse = step.dt * this.m_maxMotorForce;
		this.m_motorImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
		impulse = this.m_motorImpulse - oldImpulse;
		PX = impulse * this.m_axis.x;
		PY = impulse * this.m_axis.y;
		L1 = impulse * this.m_a1;
		L2 = impulse * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	var Cdot1X = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
	var Cdot1Y = w2 - w1;
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var f1 = this.m_impulse.Copy();
		var df = this.m_K.Solve33(new Box2D.Common.Math.b2Vec3(0, 0, 0), (-Cdot1X), (-Cdot1Y), (-Cdot2));
		this.m_impulse.Add(df);
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			this.m_impulse.z = Math.max(this.m_impulse.z, 0.0);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			this.m_impulse.z = Math.min(this.m_impulse.z, 0.0);
		}
		var bX = (-Cdot1X) - (this.m_impulse.z - f1.z) * this.m_K.col3.x;
		var bY = (-Cdot1Y) - (this.m_impulse.z - f1.z) * this.m_K.col3.y;
		var f2r = this.m_K.Solve22(Box2D.Common.Math.b2Vec2.Get(0, 0), bX, bY);
		f2r.x += f1.x;
		f2r.y += f1.y;
		this.m_impulse.x = f2r.x;
		this.m_impulse.y = f2r.y;
		df.x = this.m_impulse.x - f1.x;
		df.y = this.m_impulse.y - f1.y;
		df.z = this.m_impulse.z - f1.z;
		PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
		PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
		L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
		L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	} else {
		var df2 = this.m_K.Solve22(Box2D.Common.Math.b2Vec2.Get(0, 0), (-Cdot1X), (-Cdot1Y));
		this.m_impulse.x += df2.x;
		this.m_impulse.y += df2.y;
		PX = df2.x * this.m_perp.x;
		PY = df2.x * this.m_perp.y;
		L1 = df2.x * this.m_s1 + df2.y;
		L2 = df2.x * this.m_s2 + df2.y;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	bA.m_linearVelocity.SetV(v1);
	bA.m_angularVelocity = w1;
	bB.m_linearVelocity.SetV(v2);
	bB.m_angularVelocity = w2;
};

Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var limitC = 0;
	var oldLimitImpulse = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var c1 = bA.m_sweep.c;
	var a1 = bA.m_sweep.a;
	var c2 = bB.m_sweep.c;
	var a2 = bB.m_sweep.a;
	var tMat;
	var tX = 0;
	var m1 = 0;
	var m2 = 0;
	var i1 = 0;
	var i2 = 0;
	var linearError = 0.0;
	var angularError = 0.0;
	var active = false;
	var C2 = 0.0;
	var R1 = Box2D.Common.Math.b2Mat22.FromAngle(a1);
	var R2 = Box2D.Common.Math.b2Mat22.FromAngle(a2);
	tMat = R1;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = R2;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = c2.x + r2X - c1.x - r1X;
	var dY = c2.y + r2Y - c1.y - r1Y;
	if (this.m_enableLimit) {
		this.m_axis = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localXAxis1);
		this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
		this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
		var translation = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = Math.abs(translation);
			active = true;
		} else if (translation <= this.m_lowerTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_lowerTranslation + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			linearError = this.m_lowerTranslation - translation;
			active = true;
		} else if (translation >= this.m_upperTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_upperTranslation + Box2D.Common.b2Settings.b2_linearSlop, 0.0, Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = translation - this.m_upperTranslation;
			active = true;
		}
	}
	this.m_perp = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localYAxis1);
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	var C1X = this.m_perp.x * dX + this.m_perp.y * dY;
	var C1Y = a2 - a1 - this.m_refAngle;
	linearError = Math.max(linearError, Math.abs(C1X));
	angularError = Math.abs(C1Y);
	if (active) {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
		this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
		this.m_K.col2.x = this.m_K.col1.y;
		this.m_K.col2.y = i1 + i2;
		this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
		this.m_K.col3.x = this.m_K.col1.z;
		this.m_K.col3.y = this.m_K.col2.z;
		this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
		this.m_K.Solve33(impulse, (-C1X), (-C1Y), (-C2));
	} else {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		var k12 = i1 * this.m_s1 + i2 * this.m_s2;
		var k22 = i1 + i2;
		this.m_K.col1.Set(k11, k12, 0.0);
		this.m_K.col2.Set(k12, k22, 0.0);
		var impulse1 = this.m_K.Solve22(Box2D.Common.Math.b2Vec2.Get(0, 0), (-C1X), (-C1Y));
		impulse.x = impulse1.x;
		impulse.y = impulse1.y;
		impulse.z = 0.0;
	}
	var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x;
	var PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y;
	var L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1;
	var L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
	c1.x -= this.m_invMassA * PX;
	c1.y -= this.m_invMassA * PY;
	a1 -= this.m_invIA * L1;
	c2.x += this.m_invMassB * PX;
	c2.y += this.m_invMassB * PY;
	a2 += this.m_invIB * L2;
	bA.m_sweep.a = a1;
	bB.m_sweep.a = a2;
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return linearError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2PrismaticJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAxisA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint;
	this.localAxisA.Set(1.0, 0.0);
	this.referenceAngle = 0.0;
	this.enableLimit = false;
	this.lowerTranslation = 0.0;
	this.upperTranslation = 0.0;
	this.enableMotor = false;
	this.maxMotorForce = 0.0;
	this.motorSpeed = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2PrismaticJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2PrismaticJointDef.prototype.Initialize = function(bA, bB, anchor, axis) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
	this.localAxisA = this.bodyA.GetLocalVector(axis);
	this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};

Box2D.Dynamics.Joints.b2PrismaticJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2PrismaticJoint(this);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2PulleyJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2PulleyJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_groundAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_groundAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_u1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_u2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_ground = this.m_bodyA.m_world.m_groundBody;
	this.m_groundAnchor1.x = def.groundAnchorA.x - this.m_ground.m_xf.position.x;
	this.m_groundAnchor1.y = def.groundAnchorA.y - this.m_ground.m_xf.position.y;
	this.m_groundAnchor2.x = def.groundAnchorB.x - this.m_ground.m_xf.position.x;
	this.m_groundAnchor2.y = def.groundAnchorB.y - this.m_ground.m_xf.position.y;
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_ratio = def.ratio;
	this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
	this.m_maxLength1 = Math.min(def.maxLengthA, this.m_constant - this.m_ratio * Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength);
	this.m_maxLength2 = Math.min(def.maxLengthB, (this.m_constant - Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
	this.m_impulse = 0.0;
	this.m_limitImpulse1 = 0.0;
	this.m_limitImpulse2 = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2PulleyJoint, Box2D.Dynamics.Joints.b2Joint);


Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return 0.0;
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetGroundAnchorA = function() {
	var a = this.m_ground.m_xf.position.Copy();
	a.Add(this.m_groundAnchor1);
	return a;
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetGroundAnchorB = function() {
	var a = this.m_ground.m_xf.position.Copy();
	a.Add(this.m_groundAnchor2);
	return a;
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetLength1 = function() {
	var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
	var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
	var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
	var dX = p.x - sX;
	var dY = p.y - sY;
	return Math.sqrt(dX * dX + dY * dY);
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetLength2 = function() {
	var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
	var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
	var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
	var dX = p.x - sX;
	var dY = p.y - sY;
	return Math.sqrt(dX * dX + dY * dY);
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetRatio = function() {
	return this.m_ratio;
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var p1X = bA.m_sweep.c.x + r1X;
	var p1Y = bA.m_sweep.c.y + r1Y;
	var p2X = bB.m_sweep.c.x + r2X;
	var p2Y = bB.m_sweep.c.y + r2Y;
	var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
	var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
	var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
	var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
	this.m_u1.Set(p1X - s1X, p1Y - s1Y);
	this.m_u2.Set(p2X - s2X, p2Y - s2Y);
	var length1 = this.m_u1.Length();
	var length2 = this.m_u2.Length();
	if (length1 > Box2D.Common.b2Settings.b2_linearSlop) {
		this.m_u1.Multiply(1.0 / length1);
	} else {
		this.m_u1.SetZero();
	}
	if (length2 > Box2D.Common.b2Settings.b2_linearSlop) {
		this.m_u2.Multiply(1.0 / length2);
	} else {
		this.m_u2.SetZero();
	}
	var C = this.m_constant - length1 - this.m_ratio * length2;
	if (C > 0.0) {
		this.m_state = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
		this.m_impulse = 0.0;
	} else {
		this.m_state = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
	}
	if (length1 < this.m_maxLength1) {
		this.m_limitState1 = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
		this.m_limitImpulse1 = 0.0;
	} else {
		this.m_limitState1 = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
	}
	if (length2 < this.m_maxLength2) {
		this.m_limitState2 = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
		this.m_limitImpulse2 = 0.0;
	} else {
		this.m_limitState2 = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
	}
	var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
	var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
	this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
	this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
	this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
	this.m_limitMass1 = 1.0 / this.m_limitMass1;
	this.m_limitMass2 = 1.0 / this.m_limitMass2;
	this.m_pulleyMass = 1.0 / this.m_pulleyMass;
	if (step.warmStarting) {
		this.m_impulse *= step.dtRatio;
		this.m_limitImpulse1 *= step.dtRatio;
		this.m_limitImpulse2 *= step.dtRatio;
		var P1X = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.x;
		var P1Y = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.y;
		var P2X = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.x;
		var P2Y = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.y;
		bA.m_linearVelocity.x += bA.m_invMass * P1X;
		bA.m_linearVelocity.y += bA.m_invMass * P1Y;
		bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
		bB.m_linearVelocity.x += bB.m_invMass * P2X;
		bB.m_linearVelocity.y += bB.m_invMass * P2Y;
		bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
	} else {
		this.m_impulse = 0.0;
		this.m_limitImpulse1 = 0.0;
		this.m_limitImpulse2 = 0.0;
	}
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var v1X = 0;
	var v1Y = 0;
	var v2X = 0;
	var v2Y = 0;
	var P1X = 0;
	var P1Y = 0;
	var P2X = 0;
	var P2Y = 0;
	var Cdot = 0;
	var impulse = 0;
	var oldImpulse = 0;
	if (this.m_state == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
		v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
		v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
		v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
		Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y)) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
		impulse = this.m_pulleyMass * ((-Cdot));
		oldImpulse = this.m_impulse;
		this.m_impulse = Math.max(0.0, this.m_impulse + impulse);
		impulse = this.m_impulse - oldImpulse;
		P1X = (-impulse * this.m_u1.x);
		P1Y = (-impulse * this.m_u1.y);
		P2X = (-this.m_ratio * impulse * this.m_u2.x);
		P2Y = (-this.m_ratio * impulse * this.m_u2.y);
		bA.m_linearVelocity.x += bA.m_invMass * P1X;
		bA.m_linearVelocity.y += bA.m_invMass * P1Y;
		bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
		bB.m_linearVelocity.x += bB.m_invMass * P2X;
		bB.m_linearVelocity.y += bB.m_invMass * P2Y;
		bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
	}
	if (this.m_limitState1 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
		v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
		Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y));
		impulse = (-this.m_limitMass1 * Cdot);
		oldImpulse = this.m_limitImpulse1;
		this.m_limitImpulse1 = Math.max(0.0, this.m_limitImpulse1 + impulse);
		impulse = this.m_limitImpulse1 - oldImpulse;
		P1X = (-impulse * this.m_u1.x);
		P1Y = (-impulse * this.m_u1.y);
		bA.m_linearVelocity.x += bA.m_invMass * P1X;
		bA.m_linearVelocity.y += bA.m_invMass * P1Y;
		bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
	}
	if (this.m_limitState2 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
		v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
		Cdot = (-(this.m_u2.x * v2X + this.m_u2.y * v2Y));
		impulse = (-this.m_limitMass2 * Cdot);
		oldImpulse = this.m_limitImpulse2;
		this.m_limitImpulse2 = Math.max(0.0, this.m_limitImpulse2 + impulse);
		impulse = this.m_limitImpulse2 - oldImpulse;
		P2X = (-impulse * this.m_u2.x);
		P2Y = (-impulse * this.m_u2.y);
		bB.m_linearVelocity.x += bB.m_invMass * P2X;
		bB.m_linearVelocity.y += bB.m_invMass * P2Y;
		bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
	}
};

Box2D.Dynamics.Joints.b2PulleyJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
	var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
	var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
	var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
	var r1X = 0;
	var r1Y = 0;
	var r2X = 0;
	var r2Y = 0;
	var p1X = 0;
	var p1Y = 0;
	var p2X = 0;
	var p2Y = 0;
	var length1 = 0;
	var length2 = 0;
	var C = 0;
	var impulse = 0;
	var oldImpulse = 0;
	var oldLimitPositionImpulse = 0;
	var tX = 0;
	var linearError = 0.0;
	if (this.m_state == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		p1X = bA.m_sweep.c.x + r1X;
		p1Y = bA.m_sweep.c.y + r1Y;
		p2X = bB.m_sweep.c.x + r2X;
		p2Y = bB.m_sweep.c.y + r2Y;
		this.m_u1.Set(p1X - s1X, p1Y - s1Y);
		this.m_u2.Set(p2X - s2X, p2Y - s2Y);
		length1 = this.m_u1.Length();
		length2 = this.m_u2.Length();
		if (length1 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u1.Multiply(1.0 / length1);
		} else {
			this.m_u1.SetZero();
		}
		if (length2 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u2.Multiply(1.0 / length2);
		} else {
			this.m_u2.SetZero();
		}
		C = this.m_constant - length1 - this.m_ratio * length2;
		linearError = Math.max(linearError, (-C));
		C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
		impulse = (-this.m_pulleyMass * C);
		p1X = (-impulse * this.m_u1.x);
		p1Y = (-impulse * this.m_u1.y);
		p2X = (-this.m_ratio * impulse * this.m_u2.x);
		p2Y = (-this.m_ratio * impulse * this.m_u2.y);
		bA.m_sweep.c.x += bA.m_invMass * p1X;
		bA.m_sweep.c.y += bA.m_invMass * p1Y;
		bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
		bB.m_sweep.c.x += bB.m_invMass * p2X;
		bB.m_sweep.c.y += bB.m_invMass * p2Y;
		bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
		bA.SynchronizeTransform();
		bB.SynchronizeTransform();
	}
	if (this.m_limitState1 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		p1X = bA.m_sweep.c.x + r1X;
		p1Y = bA.m_sweep.c.y + r1Y;
		this.m_u1.Set(p1X - s1X, p1Y - s1Y);
		length1 = this.m_u1.Length();
		if (length1 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u1.x *= 1.0 / length1;
			this.m_u1.y *= 1.0 / length1;
		} else {
			this.m_u1.SetZero();
		}
		C = this.m_maxLength1 - length1;
		linearError = Math.max(linearError, (-C));
		C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
		impulse = (-this.m_limitMass1 * C);
		p1X = (-impulse * this.m_u1.x);
		p1Y = (-impulse * this.m_u1.y);
		bA.m_sweep.c.x += bA.m_invMass * p1X;
		bA.m_sweep.c.y += bA.m_invMass * p1Y;
		bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
		bA.SynchronizeTransform();
	}
	if (this.m_limitState2 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		p2X = bB.m_sweep.c.x + r2X;
		p2Y = bB.m_sweep.c.y + r2Y;
		this.m_u2.Set(p2X - s2X, p2Y - s2Y);
		length2 = this.m_u2.Length();
		if (length2 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u2.x *= 1.0 / length2;
			this.m_u2.y *= 1.0 / length2;
		}
		else {
			this.m_u2.SetZero();
		}
		C = this.m_maxLength2 - length2;
		linearError = Math.max(linearError, (-C));
		C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
		impulse = (-this.m_limitMass2 * C);
		p2X = (-impulse * this.m_u2.x);
		p2Y = (-impulse * this.m_u2.y);
		bB.m_sweep.c.x += bB.m_invMass * p2X;
		bB.m_sweep.c.y += bB.m_invMass * p2Y;
		bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
		bB.SynchronizeTransform();
	}
	return linearError < Box2D.Common.b2Settings.b2_linearSlop;
};

Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 1.0;

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2PulleyJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.groundAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.groundAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint;
	this.groundAnchorA.Set((-1.0), 1.0);
	this.groundAnchorB.Set(1.0, 1.0);
	this.localAnchorA.Set((-1.0), 0.0);
	this.localAnchorB.Set(1.0, 0.0);
	this.lengthA = 0.0;
	this.maxLengthA = 0.0;
	this.lengthB = 0.0;
	this.maxLengthB = 0.0;
	this.ratio = 1.0;
	this.collideConnected = true;
};
c2inherit(Box2D.Dynamics.Joints.b2PulleyJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2PulleyJointDef.prototype.Initialize = function(bA, bB, gaA, gaB, anchorA, anchorB, r) {
	if (r === undefined) r = 0;
	this.bodyA = bA;
	this.bodyB = bB;
	this.groundAnchorA.SetV(gaA);
	this.groundAnchorB.SetV(gaB);
	this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
	var d1X = anchorA.x - gaA.x;
	var d1Y = anchorA.y - gaA.y;
	this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
	var d2X = anchorB.x - gaB.x;
	var d2Y = anchorB.y - gaB.y;
	this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
	this.ratio = r;
	var C = this.lengthA + this.ratio * this.lengthB;
	this.maxLengthA = C - this.ratio * Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength;
	this.maxLengthB = (C - Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength) / this.ratio;
};

Box2D.Dynamics.Joints.b2PulleyJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2PulleyJoint(this);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2RevoluteJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2RevoluteJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.K = new Box2D.Common.Math.b2Mat22();
	this.K1 = new Box2D.Common.Math.b2Mat22();
	this.K2 = new Box2D.Common.Math.b2Mat22();
	this.K3 = new Box2D.Common.Math.b2Mat22();
	this.impulse3 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.impulse2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.reduced = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass = new Box2D.Common.Math.b2Mat33();
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_referenceAngle = def.referenceAngle;
	this.m_impulse.SetZero();
	this.m_motorImpulse = 0.0;
	this.m_lowerAngle = def.lowerAngle;
	this.m_upperAngle = def.upperAngle;
	this.m_maxMotorTorque = def.maxMotorTorque;
	this.m_motorSpeed = def.motorSpeed;
	this.m_enableLimit = def.enableLimit;
	this.m_enableMotor = def.enableMotor;
	this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
};
c2inherit(Box2D.Dynamics.Joints.b2RevoluteJoint, Box2D.Dynamics.Joints.b2Joint);


Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_impulse.z;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetJointAngle = function() {
	return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetJointSpeed = function() {
	return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.IsLimitEnabled = function() {
	return this.m_enableLimit;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.EnableLimit = function(flag) {
	this.m_enableLimit = flag;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetLowerLimit = function() {
	return this.m_lowerAngle;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetUpperLimit = function() {
	return this.m_upperAngle;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SetLimits = function(lower, upper) {
	if (lower === undefined) lower = 0;
	if (upper === undefined) upper = 0;
	this.m_lowerAngle = lower;
	this.m_upperAngle = upper;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.IsMotorEnabled = function() {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	return this.m_enableMotor;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.EnableMotor = function(flag) {
	this.m_enableMotor = flag;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SetMotorSpeed = function(speed) {
	if (speed === undefined) speed = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_motorSpeed = speed;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetMotorSpeed = function() {
	return this.m_motorSpeed;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SetMaxMotorTorque = function(torque) {
	if (torque === undefined) torque = 0;
	this.m_maxMotorTorque = torque;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetMotorTorque = function() {
	return this.m_maxMotorTorque;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var m1 = bA.m_invMass;
	var m2 = bB.m_invMass;
	var i1 = bA.m_invI;
	var i2 = bB.m_invI;
	this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
	this.m_mass.col2.x = (-r1Y * r1X * i1) - r2Y * r2X * i2;
	this.m_mass.col3.x = (-r1Y * i1) - r2Y * i2;
	this.m_mass.col1.y = this.m_mass.col2.x;
	this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
	this.m_mass.col3.y = r1X * i1 + r2X * i2;
	this.m_mass.col1.z = this.m_mass.col3.x;
	this.m_mass.col2.z = this.m_mass.col3.y;
	this.m_mass.col3.z = i1 + i2;
	this.m_motorMass = 1.0 / (i1 + i2);
	if (!this.m_enableMotor) {
		this.m_motorImpulse = 0.0;
	}
	if (this.m_enableLimit) {
		var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
		if (Math.abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * Box2D.Common.b2Settings.b2_angularSlop) {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_equalLimits;
		} else if (jointAngle <= this.m_lowerAngle) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
				this.m_impulse.z = 0.0;
			}
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit;
		} else if (jointAngle >= this.m_upperAngle) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
				this.m_impulse.z = 0.0;
			}
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
		} else {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
			this.m_impulse.z = 0.0;
		}
	} else {
		this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	}
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_motorImpulse *= step.dtRatio;
		var PX = this.m_impulse.x;
		var PY = this.m_impulse.y;
		bA.m_linearVelocity.x -= m1 * PX;
		bA.m_linearVelocity.y -= m1 * PY;
		bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
		bB.m_linearVelocity.x += m2 * PX;
		bB.m_linearVelocity.y += m2 * PY;
		bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
	} else {
		this.m_impulse.SetZero();
		this.m_motorImpulse = 0.0;
	}
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	var newImpulse = 0;
	var r1X = 0;
	var r1Y = 0;
	var r2X = 0;
	var r2Y = 0;
	var v1 = bA.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var v2 = bB.m_linearVelocity;
	var w2 = bB.m_angularVelocity;
	var m1 = bA.m_invMass;
	var m2 = bB.m_invMass;
	var i1 = bA.m_invI;
	var i2 = bB.m_invI;
	if (this.m_enableMotor && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
		var Cdot = w2 - w1 - this.m_motorSpeed;
		var impulse = this.m_motorMass * ((-Cdot));
		var oldImpulse = this.m_motorImpulse;
		var maxImpulse = step.dt * this.m_maxMotorTorque;
		this.m_motorImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
		impulse = this.m_motorImpulse - oldImpulse;
		w1 -= i1 * impulse;
		w2 += i2 * impulse;
	}
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		var Cdot1X = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
		var Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
		var Cdot2 = w2 - w1;
		this.m_mass.Solve33(this.impulse3, (-Cdot1X), (-Cdot1Y), (-Cdot2));
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
			this.m_impulse.Add(this.impulse3);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			newImpulse = this.m_impulse.z + this.impulse3.z;
			if (newImpulse < 0.0) {
				this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
				this.impulse3.x = this.reduced.x;
				this.impulse3.y = this.reduced.y;
				this.impulse3.z = (-this.m_impulse.z);
				this.m_impulse.x += this.reduced.x;
				this.m_impulse.y += this.reduced.y;
				this.m_impulse.z = 0.0;
			}
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			newImpulse = this.m_impulse.z + this.impulse3.z;
			if (newImpulse > 0.0) {
				this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
				this.impulse3.x = this.reduced.x;
				this.impulse3.y = this.reduced.y;
				this.impulse3.z = (-this.m_impulse.z);
				this.m_impulse.x += this.reduced.x;
				this.m_impulse.y += this.reduced.y;
				this.m_impulse.z = 0.0;
			}
		}
		v1.x -= m1 * this.impulse3.x;
		v1.y -= m1 * this.impulse3.y;
		w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
		v2.x += m2 * this.impulse3.x;
		v2.y += m2 * this.impulse3.y;
		w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
	} else {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		var CdotX = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
		var CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
		this.m_mass.Solve22(this.impulse2, (-CdotX), (-CdotY));
		this.m_impulse.x += this.impulse2.x;
		this.m_impulse.y += this.impulse2.y;
		v1.x -= m1 * this.impulse2.x;
		v1.y -= m1 * this.impulse2.y;
		w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
		v2.x += m2 * this.impulse2.x;
		v2.y += m2 * this.impulse2.y;
		w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
	}
	bA.m_linearVelocity.SetV(v1);
	bA.m_angularVelocity = w1;
	bB.m_linearVelocity.SetV(v2);
	bB.m_angularVelocity = w2;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var oldLimitImpulse = 0;
	var C = 0;
	var tMat;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var angularError = 0.0;
	var positionError = 0.0;
	var tX = 0;
	var impulseX = 0;
	var impulseY = 0;
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
		var limitImpulse = 0.0;
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
			C = Box2D.Common.Math.b2Math.Clamp(angle - this.m_lowerAngle, (-Box2D.Common.b2Settings.b2_maxAngularCorrection), Box2D.Common.b2Settings.b2_maxAngularCorrection);
			limitImpulse = (-this.m_motorMass * C);
			angularError = Math.abs(C);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			C = angle - this.m_lowerAngle;
			angularError = (-C);
			C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_angularSlop, (-Box2D.Common.b2Settings.b2_maxAngularCorrection), 0.0);
			limitImpulse = (-this.m_motorMass * C);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			C = angle - this.m_upperAngle;
			angularError = C;
			C = Box2D.Common.Math.b2Math.Clamp(C - Box2D.Common.b2Settings.b2_angularSlop, 0.0, Box2D.Common.b2Settings.b2_maxAngularCorrection);
			limitImpulse = (-this.m_motorMass * C);
		}
		bA.m_sweep.a -= bA.m_invI * limitImpulse;
		bB.m_sweep.a += bB.m_invI * limitImpulse;
		bA.SynchronizeTransform();
		bB.SynchronizeTransform();
	}
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	var CLengthSquared = CX * CX + CY * CY;
	var CLength = Math.sqrt(CLengthSquared);
	positionError = CLength;
	var invMass1 = bA.m_invMass;
	var invMass2 = bB.m_invMass;
	var invI1 = bA.m_invI;
	var invI2 = bB.m_invI;
	var k_allowedStretch = 10.0 * Box2D.Common.b2Settings.b2_linearSlop;
	if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
		var uX = CX / CLength;
		var uY = CY / CLength;
		var k = invMass1 + invMass2;
		var m = 1.0 / k;
		impulseX = m * ((-CX));
		impulseY = m * ((-CY));
		var k_beta = 0.5;
		bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
		bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
		bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
		bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
		CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
		CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	}
	this.K1.col1.x = invMass1 + invMass2;
	this.K1.col2.x = 0.0;
	this.K1.col1.y = 0.0;
	this.K1.col2.y = invMass1 + invMass2;
	this.K2.col1.x = invI1 * r1Y * r1Y;
	this.K2.col2.x = (-invI1 * r1X * r1Y);
	this.K2.col1.y = (-invI1 * r1X * r1Y);
	this.K2.col2.y = invI1 * r1X * r1X;
	this.K3.col1.x = invI2 * r2Y * r2Y;
	this.K3.col2.x = (-invI2 * r2X * r2Y);
	this.K3.col1.y = (-invI2 * r2X * r2Y);
	this.K3.col2.y = invI2 * r2X * r2X;
	this.K.SetM(this.K1);
	this.K.AddM(this.K2);
	this.K.AddM(this.K3);
	this.K.Solve(Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse, (-CX), (-CY));
	impulseX = Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse.x;
	impulseY = Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse.y;
	bA.m_sweep.c.x -= bA.m_invMass * impulseX;
	bA.m_sweep.c.y -= bA.m_invMass * impulseY;
	bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
	bB.m_sweep.c.x += bB.m_invMass * impulseX;
	bB.m_sweep.c.y += bB.m_invMass * impulseY;
	bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return positionError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};

Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = Box2D.Common.Math.b2Vec2.Get(0, 0);

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2RevoluteJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint;
	this.localAnchorA.SetZero();
	this.localAnchorB.SetZero();
	this.referenceAngle = 0.0;
	this.lowerAngle = 0.0;
	this.upperAngle = 0.0;
	this.maxMotorTorque = 0.0;
	this.motorSpeed = 0.0;
	this.enableLimit = false;
	this.enableMotor = false;
};
c2inherit(Box2D.Dynamics.Joints.b2RevoluteJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2RevoluteJointDef.prototype.Initialize = function(bA, bB, anchor) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
	this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};

Box2D.Dynamics.Joints.b2RevoluteJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2RevoluteJoint(this);
};

/**
 * @param {!Box2D.Dynamics.Joints.b2WeldJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2WeldJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass = new Box2D.Common.Math.b2Mat33();
	this.m_localAnchorA.SetV(def.localAnchorA);
	this.m_localAnchorB.SetV(def.localAnchorB);
	this.m_referenceAngle = def.referenceAngle;
};
c2inherit(Box2D.Dynamics.Joints.b2WeldJoint, Box2D.Dynamics.Joints.b2Joint);

Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
};

Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
};

/**
 * @param {number} inv_dt
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetReactionForce = function(inv_dt) {
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
};

/**
 * @param {number} inv_dt
 * @return {number}
 */
Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetReactionTorque = function(inv_dt) {
	return inv_dt * this.m_impulse.z;
};

Box2D.Dynamics.Joints.b2WeldJoint.prototype.InitVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
	this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
	this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
	this.m_mass.col1.y = this.m_mass.col2.x;
	this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
	this.m_mass.col3.y = rAX * iA + rBX * iB;
	this.m_mass.col1.z = this.m_mass.col3.x;
	this.m_mass.col2.z = this.m_mass.col3.y;
	this.m_mass.col3.z = iA + iB;
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_impulse.z *= step.dtRatio;
		bA.m_linearVelocity.x -= mA * this.m_impulse.x;
		bA.m_linearVelocity.y -= mA * this.m_impulse.y;
		bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
		bB.m_linearVelocity.x += mB * this.m_impulse.x;
		bB.m_linearVelocity.y += mB * this.m_impulse.y;
		bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
	} else {
		this.m_impulse.SetZero();
	}
};

Box2D.Dynamics.Joints.b2WeldJoint.prototype.SolveVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var vA = bA.m_linearVelocity;
	var wA = bA.m_angularVelocity;
	var vB = bB.m_linearVelocity;
	var wB = bB.m_angularVelocity;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
	var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
	var Cdot2 = wB - wA;
	var impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass.Solve33(impulse, (-Cdot1X), (-Cdot1Y), (-Cdot2));
	this.m_impulse.Add(impulse);
	vA.x -= mA * impulse.x;
	vA.y -= mA * impulse.y;
	wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
	vB.x += mB * impulse.x;
	vB.y += mB * impulse.y;
	wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
	bA.m_angularVelocity = wA;
	bB.m_angularVelocity = wB;
};

Box2D.Dynamics.Joints.b2WeldJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
	var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
	var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
	var k_allowedStretch = 10.0 * Box2D.Common.b2Settings.b2_linearSlop;
	var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
	var angularError = Math.abs(C2);
	if (positionError > k_allowedStretch) {
		iA *= 1.0;
		iB *= 1.0;
	}
	this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
	this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
	this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
	this.m_mass.col1.y = this.m_mass.col2.x;
	this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
	this.m_mass.col3.y = rAX * iA + rBX * iB;
	this.m_mass.col1.z = this.m_mass.col3.x;
	this.m_mass.col2.z = this.m_mass.col3.y;
	this.m_mass.col3.z = iA + iB;
	var impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass.Solve33(impulse, (-C1X), (-C1Y), (-C2));
	bA.m_sweep.c.x -= mA * impulse.x;
	bA.m_sweep.c.y -= mA * impulse.y;
	bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
	bB.m_sweep.c.x += mB * impulse.x;
	bB.m_sweep.c.y += mB * impulse.y;
	bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return positionError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};

/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2WeldJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_weldJoint;
	this.referenceAngle = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2WeldJointDef, Box2D.Dynamics.Joints.b2JointDef);

Box2D.Dynamics.Joints.b2WeldJointDef.prototype.Initialize = function(bA, bB, anchor) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
	this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
	this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};

Box2D.Dynamics.Joints.b2WeldJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2WeldJoint(this);
};

Box2D.Collision.b2Collision.s_incidentEdge = Box2D.Collision.b2Collision.MakeClipPointVector();
Box2D.Collision.b2Collision.s_clipPoints1 = Box2D.Collision.b2Collision.MakeClipPointVector();
Box2D.Collision.b2Collision.s_clipPoints2 = Box2D.Collision.b2Collision.MakeClipPointVector();
Box2D.Collision.b2Collision.s_localTangent = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_localNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_planePoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_tangent = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_tangent2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_v11 = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_v12 = Box2D.Common.Math.b2Vec2.Get(0, 0);

Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0;
Box2D.Collision.b2TimeOfImpact.s_cache = new Box2D.Collision.b2SimplexCache();
Box2D.Collision.b2TimeOfImpact.s_distanceInput = new Box2D.Collision.b2DistanceInput();
Box2D.Collision.b2TimeOfImpact.s_xfA = new Box2D.Common.Math.b2Transform();
Box2D.Collision.b2TimeOfImpact.s_xfB = new Box2D.Common.Math.b2Transform();
Box2D.Collision.b2TimeOfImpact.s_fcn = new Box2D.Collision.b2SeparationFunction();
Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new Box2D.Collision.b2DistanceOutput();

/** @type {!Box2D.Common.Math.b2Transform} */
Box2D.Dynamics.b2Body.s_xf1 = new Box2D.Common.Math.b2Transform();

Box2D.Dynamics.b2ContactListener.b2_defaultListener = new Box2D.Dynamics.b2ContactListener();

Box2D.Dynamics.b2ContactManager.s_evalCP = new Box2D.Collision.b2ContactPoint();

/** @type {!Box2D.Common.Math.b2Transform} */
Box2D.Dynamics.b2World.s_xf = new Box2D.Common.Math.b2Transform();

/** @type {!Box2D.Common.Math.b2Sweep} */
Box2D.Dynamics.b2World.s_backupA = new Box2D.Common.Math.b2Sweep();

/** @type {!Box2D.Common.Math.b2Sweep} */
Box2D.Dynamics.b2World.s_backupB = new Box2D.Common.Math.b2Sweep();

Box2D.Dynamics.Contacts.b2Contact.s_input = new Box2D.Collision.b2TOIInput();

Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new Box2D.Collision.b2WorldManifold();
Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new Box2D.Dynamics.Contacts.b2PositionSolverManifold();

///////////////////////////////////////////////////////////////////////////////////////////////
// b2Separator
// Translated from code written by Antoan Angelov
// http://www.emanueleferonato.com/2011/09/12/create-non-convex-complex-shapes-with-box2d/
// Original license:
/*
* Convex Separator for Box2D Flash
*
* This class has been written by Antoan Angelov. 
* It is designed to work with Erin Catto's Box2D physics library.
*
* Everybody can use this software for any purpose, under two restrictions:
* 1. You cannot claim that you wrote this software.
* 2. You can not remove or alter this notice.
*
*/
// Translation from ActionScript to Javascript by Ashley Gullen
cr.b2Separator = function() {};

cr.b2Separator.det = function(x1, y1, x2, y2, x3, y3)
{
	return x1*y2 + x2*y3 + x3*y1 - y1*x2 - y2*x3 - y3*x1;
};

cr.b2Separator.hitRay = function(x1, y1, x2, y2, x3, y3, x4, y4)
{
	var t1 = x3-x1, t2 = y3-y1, t3 = x2-x1, t4 = y2-y1, t5 = x4-x3, t6 = y4-y3, t7 = t4*t5 - t3*t6;
	var a = (t5*t2 - t6*t1) / t7;
	var px = x1 + a*t3, py = y1 + a*t4;
	var b1 = cr.b2Separator.isOnSegment(x2, y2, x1, y1, px, py);
	var b2 = cr.b2Separator.isOnSegment(px, py, x3, y3, x4, y4);

	if (b1 && b2)
		return Box2D.Common.Math.b2Vec2.Get(px, py);
	else
		return null;
};

cr.b2Separator.isOnSegment = function(px, py, x1, y1, x2, y2)
{
	var b1 = (x1+0.1 >= px && px >= x2-0.1) || (x1-0.1 <= px && px <= x2+0.1);
	var b2 = (y1+0.1 >= py && py >= y2-0.1) || (y1-0.1 <= py && py <= y2+0.1);
	return (b1 && b2) && cr.b2Separator.isOnLine(px, py, x1, y1, x2, y2);
};

cr.b2Separator.isOnLine = function(px, py, x1, y1, x2, y2)
{
	if (Math.abs(x2-x1) > 0.1)
	{
		var a = (y2-y1) / (x2-x1);
		var possibleY = a * (px-x1)+y1;
		var diff = Math.abs(possibleY-py);
		return diff < 0.1;
	}

	return Math.abs(px-x1) < 0.1;
};

cr.b2Separator.pointsMatch = function(x1, y1, x2, y2)
{
	return Math.abs(x2-x1) < 0.1 && Math.abs(y2-y1) < 0.1;
};

cr.b2Separator.Separate = function(verticesVec /*array of b2Vec2*/, objarea)
{
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	
	var calced = cr.b2Separator.calcShapes(verticesVec);
	
	// deep copy output
	var ret = [];
	var poly, a, b, c;
	var i, len, j, lenj;
	var areasum;
	
	for (i = 0, len = calced.length; i < len; i++)
	{
		a = calced[i];
		poly = [];
		poly.length = a.length;
		areasum = 0;
		
		for (j = 0, lenj = a.length; j < lenj; j++)
		{
			b = a[j];
			c = a[(j + 1) % lenj];
			
			// calculating area
			areasum += (b.x * c.y - b.y * c.x);
			
			// copy vertex
			poly[j] = b2Vec2.Get(b.x, b.y);
		}
		
		areasum = Math.abs(areasum / 2);
		
		// The separation algorithm seems to generate tiny polygons as artefacts.
		// I've no idea why (TODO: find out why).  As a hack, any polygons
		// with an area less than 0.1% the total object area are discarded!
		// (This used to be 1.5%, but complex polys on large objects would incorrectly
		// get filtered.)
		if (areasum >= objarea * 0.001)
			ret.push(poly);
	}
	
	assert2(ret.length, "Physics polygon separation resulted in no polys.  Make sure all your collision masks for objects with the Physics behavior are valid and don't have any overlapping lines.");
	return ret;
};

cr.b2Separator.calcShapes = function(verticesVec /*array of b2Vec2*/)
{
	var vec = [];										// array of b2Vec2
	var i = 0, n = 0, j = 0;							// ints
	var d = 0, t = 0, dx = 0, dy = 0, minLen = 0;		// numbers
	var i1 = 0, i2 = 0, i3 = 0;							// ints
	var p1, p2, p3, v1, v2, v, hitV;					// b2Vec2s
	var j1 = 0, j2 = 0, k = 0, h = 0;					// ints
	var vec1 = [], vec2 = [];							// array of b2Vec2
	var isConvex = false;								// boolean
	var figsVec = [], queue = [];						// Arrays

	queue.push(verticesVec);

	while (queue.length)
	{
		vec = queue[0];
		n = vec.length;
		isConvex = true;

		for (i = 0; i < n; i++)
		{
			i1 = i;
			i2 = (i < n-1) ? i+1 : i+1-n;
			i3 = (i < n-2) ? i+2 : i+2-n;

			p1 = vec[i1];
			p2 = vec[i2];
			p3 = vec[i3];

			d = cr.b2Separator.det(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
			
			if (d < 0)
			{
				isConvex = false;
				minLen = 1e9;

				for (j = 0; j < n; j++)
				{
					if ((j !== i1) && (j !== i2))
					{
						j1 = j;
						j2 = (j<n - 1) ? j+1 : 0;

						v1 = vec[j1];
						v2 = vec[j2];

						v = cr.b2Separator.hitRay(p1.x, p1.y, p2.x, p2.y, v1.x, v1.y, v2.x, v2.y);

						if (v)
						{
							dx = p2.x - v.x;
							dy = p2.y - v.y;
							t = dx*dx + dy*dy;

							if (t < minLen)
							{
								h = j1;
								k = j2;
								hitV = v;
								minLen = t;
							}
						}
					}
				}

				// invalid poly
				if (minLen === 1e9)
					return [];

				vec1 = [];
				vec2 = [];

				j1 = h;
				j2 = k;
				v1 = vec[j1];
				v2 = vec[j2];

				if (!cr.b2Separator.pointsMatch(hitV.x, hitV.y, v2.x, v2.y))
					vec1.push(hitV);
					
				if (!cr.b2Separator.pointsMatch(hitV.x, hitV.y, v1.x, v1.y))
					vec2.push(hitV);

				h = -1;
				k = i1;
				
				while (true)
				{
					if (k !== j2)
						vec1.push(vec[k]);
					else
					{
						// invalid poly
						if (h < 0 || h >= n)
							return [];
							
						if (!cr.b2Separator.isOnSegment(v2.x, v2.y, vec[h].x, vec[h].y, p1.x, p1.y))
							vec1.push(vec[k]);
							
						break;
					}

					h = k;
					
					if (k-1 < 0)
						k = n-1;
					else
						k--;
				}

				vec1.reverse();

				h = -1;
				k = i2;
				
				while (true)
				{
					if (k !== j1)
						vec2.push(vec[k]);
					else
					{
						// invalid poly
						if (h < 0 || h >= n)
							return [];

						if (k === j1 && !cr.b2Separator.isOnSegment(v1.x, v1.y, vec[h].x, vec[h].y, p2.x, p2.y))
							vec2.push(vec[k]);
							
						break;
					}

					h = k;
					
					if (k+1 > n-1)
						k = 0;
					else
						k++;
				}

				queue.push(vec1, vec2);
				queue.shift();

				break;
			}
		}

		if (isConvex)
			figsVec.push(queue.shift());
	}

	return figsVec;
};
///////////////////////////////////////////////////////////////////////////////////////////////

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.Physics = function(runtime)
{
	// Warm up b2vec2 cache with 4000 entries (they'll be consumed quickly)
	for (var i = 0; i < 4000; i++)
		Box2D.Common.Math.b2Vec2._freeCache.push(new Box2D.Common.Math.b2Vec2(0, 0));
	
	this.runtime = runtime;
	this.world = new Box2D.Dynamics.b2World(
								Box2D.Common.Math.b2Vec2.Get(0, 10),	// gravity
								true);									// allow sleep
	
	this.worldG = 10;
	this.lastUpdateTick = -1;
	
	// For registering collisions
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.behavior = this;
	
	listener.BeginContact = function(contact)
	{
		var behA = contact.m_fixtureA.GetBody().c2userdata;
		var behB = contact.m_fixtureB.GetBody().c2userdata;
		this.behavior.runtime.registerCollision(behA.inst, behB.inst);
	};
	
	this.world.SetContactListener(listener);
	
	// For disabling collisions
	var filter = new Box2D.Dynamics.b2ContactFilter;
	filter.behavior = this;
	
	filter.ShouldCollide = function (fixtureA, fixtureB)
	{
		if (this.behavior.allCollisionsEnabled)
			return true;
			
		var typeA = fixtureA.GetBody().c2userdata.inst.type;
		var typeB = fixtureB.GetBody().c2userdata.inst.type;
		
		var s = typeA.extra["Physics_DisabledCollisions"];
		if (s && s.contains(typeB))
			return false;
			
		s = typeB.extra["Physics_DisabledCollisions"];
		if (s && s.contains(typeA))
			return false;
			
		return true;
	};
	
	this.world.SetContactFilter(filter);
	
	this.steppingMode = 0;		// fixed
	this.velocityIterations = 8;
	this.positionIterations = 3;
	this.allCollisionsEnabled = true;
	
	/**PREVIEWONLY**/cr.physics_cpu_time = new cr.KahanAdder();
};

(function ()
{
	// Import Box2D names
	var b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2Transform = Box2D.Common.Math.b2Transform,
		b2Mat22 = Box2D.Common.Math.b2Mat22;
	
	// From Tilemap
	var TILE_FLIPPED_HORIZONTAL = -0x80000000		// note: pretend is a signed int, so negate
	var TILE_FLIPPED_VERTICAL = 0x40000000
	var TILE_FLIPPED_DIAGONAL = 0x20000000
	var TILE_FLAGS_MASK = 0xE0000000
		
	// box2D apparently works well with sizes ranging 0.1 to 10 - this means our objects
	// should work well over a 5 to 500 pixel range.
	var worldScale = 0.02;
		  
	var behaviorProto = cr.behaviors.Physics.prototype;
	
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.world = this.behavior.world;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		this.immovable = (this.properties[0] !== 0);
		this.collisionmask = this.properties[1];
		this.preventRotation = (this.properties[2] !== 0);
		this.density = this.properties[3];
		this.friction = this.properties[4];
		this.restitution = this.properties[5];
		this.linearDamping = this.properties[6];
		this.angularDamping = this.properties[7];
		this.bullet = (this.properties[8] !== 0);
		this.enabled = (this.properties[9] !== 0);
		
		this.body = null;
		
		this.inst.update_bbox();
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
		this.lastKnownAngle = this.inst.angle;
		this.lastWidth = 0;
		this.lastHeight = 0;
		this.lastTickOverride = false;
		this.recreateBody = false;
		
		this.lastAnimation = null;			// for sprites only - will be undefined for other objects
		this.lastAnimationFrame = -1;		// for sprites only - will be undefined for other objects
		
		if (this.myJoints)
		{
			this.myJoints.length = 0;
			this.myCreatedJoints.length = 0;
			this.joiningMe.clear();
		}
		else
		{
			this.myJoints = [];						// Created Box2D joints
			this.myCreatedJoints = [];				// List of actions called to create joints
			this.joiningMe = new cr.ObjectSet();	// Instances with joints to me
		}
		
		//this.myconvexpolys = null;
		
		// Need to know if joint-connected objects get destroyed
		var self = this;
		
		if (!this.recycled)
		{
			this.myDestroyCallback = (function(inst) {
													self.onInstanceDestroyed(inst);
												});
		}
										
		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};
	
	behinstProto.postCreate = function ()
	{
		// Sprite animation frame is now available
		this.inst.update_bbox();
		this.createBody();
		
		this.lastAnimation = this.inst.cur_animation;
		this.lastAnimationFrame = this.inst.cur_frame;
	};
	
	behinstProto.onDestroy = function()
	{
		this.destroyMyJoints();
		this.myCreatedJoints.length = 0;	
		this.joiningMe.clear();
		
		if (this.body)
		{
			this.world.DestroyBody(this.body);
			this.body = null;
		}
		
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	
	behinstProto.saveToJSON = function ()
	{
		var o = {
			"e": this.enabled,
			"im": this.immovable,
			"pr": this.preventRotation,
			"d": this.density,
			"fr": this.friction,
			"re": this.restitution,
			"ld": this.linearDamping,
			"ad": this.angularDamping,
			"b": this.bullet,
			"mcj": this.myCreatedJoints
		};
		
		if (this.enabled)
		{
			var temp = b2Vec2.Get(0, 0);
			temp.SetV(this.body.GetLinearVelocity());
			
			o["vx"] = temp.x;
			o["vy"] = temp.y;
			o["om"] = this.body.GetAngularVelocity();
		}
		
		return o;
	};
	
	behinstProto.loadFromJSON = function (o)
	{
		this.destroyMyJoints();
		this.myCreatedJoints.length = 0;
		this.joiningMe.clear();
		
		if (this.body)
		{
			this.world.DestroyBody(this.body);
			this.body = null;
		}
		
		this.enabled = o["e"];
		this.immovable = o["im"];
		this.preventRotation = o["pr"];
		this.density = o["d"];
		this.friction = o["fr"];
		this.restitution = o["re"];
		this.linearDamping = o["ld"];
		this.angularDamping = o["ad"];
		this.bullet = o["b"];
		
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
		this.lastKnownAngle = this.inst.angle;
		this.lastWidth = this.inst.width;
		this.lastHeight = this.inst.height;
		
		if (this.enabled)
		{
			this.createBody();
			
			this.body.SetLinearVelocity(b2Vec2.Get(o["vx"], o["vy"]));
			this.body.SetAngularVelocity(o["om"]);
			
			if (o["vx"] !== 0 || o["vy"] !== 0 || o["om"] !== 0)
				this.body.SetAwake(true);
			
			this.myCreatedJoints = o["mcj"];
		}
	};
	
	behinstProto.afterLoad = function ()
	{
		if (this.enabled)
			this.recreateMyJoints();
		
		this.behavior.lastUpdateTick = this.runtime.tickcount - 1;
	};
	
	behinstProto.onInstanceDestroyed = function (inst)
	{
		// Remove any joints referencing the destroyed instance
		var i, len, j, instuid = inst.uid;
		for (i = 0, j = 0, len = this.myCreatedJoints.length; i < len; i++)
		{
			this.myCreatedJoints[j] = this.myCreatedJoints[i];
			
			// Sometimes myJoints is empty if this is happening during load. Don't fill it
			// with undefined values.
			if (j < this.myJoints.length)
				this.myJoints[j] = this.myJoints[i];
			
			if (this.myCreatedJoints[i].params[1] == instuid)		// attached instance is always 2nd param
				this.world.DestroyJoint(this.myJoints[i]);
			else
				j++;
		}
		
		// Forget about any instance joining on to me if the joining instance was destroyed
		this.myCreatedJoints.length = j;
		
		if (j < this.myJoints.length)
			this.myJoints.length = j;
		
		this.joiningMe.remove(inst);
	};
	
	behinstProto.destroyMyJoints = function()
	{
		var i, len;
		for (i = 0, len = this.myJoints.length; i < len; i++)
			this.world.DestroyJoint(this.myJoints[i]);
			
		this.myJoints.length = 0;
	};
	
	behinstProto.recreateMyJoints = function()
	{
		var i, len, j;
		for (i = 0, len = this.myCreatedJoints.length; i < len; i++)
		{
			j = this.myCreatedJoints[i];
			
			switch (j.type) {
			case 0:			// distance joint
				this.doCreateDistanceJoint(j.params[0], j.params[1], j.params[2], j.params[3], j.params[4]);
				break;
			case 1:			// revolute joint
				this.doCreateRevoluteJoint(j.params[0], j.params[1]);
				break;
			case 2:			// limited revolute joint
				this.doCreateLimitedRevoluteJoint(j.params[0], j.params[1], j.params[2], j.params[3]);
				break;
			default:
				assert2(false, "Unknown physics joint type to re-create");
			}
		}
	};
	
	behinstProto.destroyBody = function()
	{
		if (!this.body)
			return;
		
		// Destroy the body and all joints, which will be recreated later
		this.destroyMyJoints();
		this.world.DestroyBody(this.body);
		this.body = null;
		this.inst.extra.box2dbody = null;
	};
	
	var collrects = [];
	
	behinstProto.createBody = function()
	{
		if (!this.enabled)
			return;
		
		var inst = this.inst;
		var hadOldBody = false;
		var oldVelocity = null;
		var oldOmega = null;
		var i, len, j, lenj, k, lenk, vec, arr, b, c, rc, pts_cache, pts_count, convexpolys, cp, offx, offy, oldAngle;
		
		if (this.body)
		{
			hadOldBody = true;
			
			// Save current body state.  Need to copy linear velocity since otherwise it takes by reference
			oldVelocity = b2Vec2.Get(0, 0);
			oldVelocity.SetV(this.body.GetLinearVelocity());
			oldOmega = this.body.GetAngularVelocity();
			
			// For each instance with joints to me, also destroy their joints - will be recreated later
			arr = this.joiningMe.valuesRef();
			
			for (i = 0, len = arr.length; i < len; i++)
			{
				b = arr[i].extra.box2dbody.c2userdata;
				b.destroyMyJoints();
			}
			
			this.destroyBody();
		}
		
		var fixDef = new b2FixtureDef;
		fixDef.density = this.density;
		fixDef.friction = this.friction;
		fixDef.restitution = this.restitution;
		
		var bodyDef = new b2BodyDef;
		
		if (this.immovable)
			bodyDef.type = 0; //b2BodyDef.b2_staticBody
		else
			bodyDef.type = 2; //b2BodyDef.b2_dynamicBody
			
		// Body expects position to be in center, but the object hotspot may not be centred.
		// Determine the actual object center.  The easiest way to do this is take its bounding
		// quad and get its mid point.
		inst.update_bbox();
		bodyDef.position.x = inst.bquad.midX() * worldScale;
		bodyDef.position.y = inst.bquad.midY() * worldScale;
		bodyDef.angle = inst.angle;
		
		bodyDef.fixedRotation = this.preventRotation;
		bodyDef.linearDamping = this.linearDamping;
		bodyDef.angularDamping = this.angularDamping;
		bodyDef.bullet = this.bullet;
		var hasPoly = this.inst.collision_poly && !this.inst.collision_poly.is_empty();
		
		// Create the body - no fixtures attached yet
		this.body = this.world.CreateBody(bodyDef);
		this.body.c2userdata = this;
		
		var usecollisionmask = this.collisionmask;
		
		// If 'use collision poly' set, but no collision poly present, switch to bounding box
		if (!hasPoly && !this.inst.tilemap_exists && this.collisionmask === 0)
			usecollisionmask = 1;
			
		// Zero size objects crash Box2D
		var instw = Math.max(Math.abs(inst.width), 1);
		var insth = Math.max(Math.abs(inst.height), 1);
		var ismirrored = inst.width < 0;
		var isflipped = inst.height < 0;
		
		// use collision poly
		if (usecollisionmask === 0)
		{
			// Is tilemap object: handle separately
			if (inst.tilemap_exists)
			{
				offx = inst.bquad.midX() - inst.x;
				offy = inst.bquad.midY() - inst.y;
				inst.getAllCollisionRects(collrects);
				
				arr = [];
				
				for (i = 0, len = collrects.length; i < len; ++i)
				{
					c = collrects[i];
					rc = c.rc;
					
					// Tile has collision polygon
					if (c.poly)
					{
						// Lazily cache in to convexpolys so we don't keep doing the expensive separate work
						// for every tile in the tilemap
						if (!c.poly.convexpolys)
						{
							pts_cache = c.poly.pts_cache;
							pts_count = c.poly.pts_count;
							
							// convert to array of b2Vec for the separator
							for (j = 0; j < pts_count; ++j)
							{
								arr.push(b2Vec2.Get(pts_cache[j*2], pts_cache[j*2+1]));
							}
							
							// mirrored or flipped: must reverse to keep clockwise points order
							var flags = (c.id & TILE_FLAGS_MASK);
							
							if (flags === TILE_FLIPPED_HORIZONTAL || flags === TILE_FLIPPED_VERTICAL || flags === TILE_FLIPPED_DIAGONAL ||
								((flags & TILE_FLIPPED_HORIZONTAL) && (flags & TILE_FLIPPED_VERTICAL) && (flags & TILE_FLIPPED_DIAGONAL)))
							{
								arr.reverse();
							}
							
							// Run the separator to split to convex polys
							c.poly.convexpolys = cr.b2Separator.Separate(arr, (rc.right - rc.left) * (rc.bottom - rc.top));
							
							for (j = 0, lenj = arr.length; j < lenj; ++j)
								b2Vec2.Free(arr[j]);
							
							arr.length = 0;
						}
						
						// Now we have the tile-relative convex polys in c.poly.convexpolys.
						// We still need to offset then scale the result.
						for (j = 0, lenj = c.poly.convexpolys.length; j < lenj; ++j)
						{
							cp = c.poly.convexpolys[j];
							assert2(cp.length >= 3, "Invalid convex poly for tile physics collision mask");
							
							for (k = 0, lenk = cp.length; k < lenk; ++k)
							{
								arr.push(b2Vec2.Get((rc.left + cp[k].x - offx) * worldScale, (rc.top + cp[k].y - offy) * worldScale));
							}
							
							fixDef.shape = new b2PolygonShape;
							fixDef.shape.SetAsArray(arr, arr.length);		// copies content of arr
							this.body.CreateFixture(fixDef);
							
							for (k = 0, lenk = arr.length; k < lenk; ++k)
								b2Vec2.Free(arr[k]);
							
							arr.length = 0;
						}
					}
					else
					{
						// Bounding box collision for this tile
						arr.push(b2Vec2.Get((rc.left - offx) * worldScale, (rc.top - offy) * worldScale));
						arr.push(b2Vec2.Get((rc.right - offx) * worldScale, (rc.top - offy) * worldScale));
						arr.push(b2Vec2.Get((rc.right - offx) * worldScale, (rc.bottom - offy) * worldScale));
						arr.push(b2Vec2.Get((rc.left - offx) * worldScale, (rc.bottom - offy) * worldScale));
					
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsArray(arr, arr.length);		// copies content of arr
						this.body.CreateFixture(fixDef);
					}
					
					for (j = 0, lenj = arr.length; j < lenj; ++j)
						b2Vec2.Free(arr[j]);
					
					arr.length = 0;
				}
			}
			else
			{
				// offset of poly from hotspot. poly has to be generated unrotated
				oldAngle = inst.angle;
				inst.angle = 0;
				inst.set_bbox_changed();
				inst.update_bbox();
				offx = inst.bquad.midX() - inst.x;
				offy = inst.bquad.midY() - inst.y;
				inst.angle = oldAngle;
				inst.set_bbox_changed();
				
				// cache the poly to get vertices at pixel scale relative to object's origin
				// don't rotate the poly for box2D, it rotates it itself
				inst.collision_poly.cache_poly(ismirrored ? -instw : instw, isflipped ? -insth : insth, 0);
				
				// convert to array of b2Vec for the separator
				pts_cache = inst.collision_poly.pts_cache;
				pts_count = inst.collision_poly.pts_count;
				arr = [];
				arr.length = pts_count;
				
				for (i = 0; i < pts_count; i++)
				{
					// offset so the poly is relative to body origin.  Don't scale yet - the separator
					// works with fractional pixel values, scaling down will throw that off
					arr[i] = b2Vec2.Get(pts_cache[i*2] - offx, pts_cache[i*2+1] - offy);
				}
				
				if (ismirrored !== isflipped)
					arr.reverse();		// wrong clockwise order when flipped
				
				// Run the separator to split to convex polys
				convexpolys = cr.b2Separator.Separate(arr, instw * insth);
				//this.myconvexpolys = convexpolys;
				
				for (i = 0; i < pts_count; i++)
					b2Vec2.Free(arr[i]);
				
				if (convexpolys.length)
				{
					// Add each convex poly as a fixture
					for (i = 0, len = convexpolys.length; i < len; i++)
					{
						arr = convexpolys[i];
						assert2(arr.length >= 3, "Invalid convex poly for physics collision mask");
						
						// Scale down each poly point
						for (j = 0, lenj = arr.length; j < lenj; j++)
						{
							vec = arr[j];
							vec.x *= worldScale;
							vec.y *= worldScale;
						}
										
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsArray(arr, arr.length);		// copies content of arr
						this.body.CreateFixture(fixDef);
						
						// recycle vec2s
						for (j = 0, lenj = arr.length; j < lenj; j++)
							b2Vec2.Free(arr[j]);
					}
				}
				// invalid poly: use bounding box
				else
				{
					fixDef.shape = new b2PolygonShape;
					fixDef.shape.SetAsBox(instw * worldScale * 0.5, insth * worldScale * 0.5);
					this.body.CreateFixture(fixDef);
				}
			}
		}
		// bounding box
		else if (usecollisionmask === 1)
		{
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(instw * worldScale * 0.5, insth * worldScale * 0.5);
			this.body.CreateFixture(fixDef);
		}
		// circle (2)
		else
		{
			fixDef.shape = new b2CircleShape(Math.min(instw, insth) * worldScale * 0.5);
			this.body.CreateFixture(fixDef);
		}
		
		inst.extra.box2dbody = this.body;
		this.lastWidth = inst.width;
		this.lastHeight = inst.height;
		
		// If recreating a body, set its old state back and re-attach any joints
		if (hadOldBody)
		{
			this.body.SetLinearVelocity(oldVelocity);
			this.body.SetAngularVelocity(oldOmega);
			b2Vec2.Free(oldVelocity);
			
			// Recreate joints which will have been broken by recreating the body
			this.recreateMyJoints();
			
			// For each instance with joints to me, also recreate their joints so they re-attach to my new body
			arr = this.joiningMe.valuesRef();
			
			for (i = 0, len = arr.length; i < len; i++)
			{
				b = arr[i].extra.box2dbody.c2userdata;
				b.recreateMyJoints();
			}
		}
		
		collrects.length = 0;
	};

	// Debug: draw polys
	/*
	behinstProto.draw = function (ctx)
	{
		if (!this.myconvexpolys)
			return;
			
		this.inst.update_bbox();
		var midx = this.inst.bquad.midX();
		var midy = this.inst.bquad.midY();
		var i, len, j, lenj;
		
		var sina = 0;
		var cosa = 1;
		
		if (this.inst.angle !== 0)
		{
			sina = Math.sin(this.inst.angle);
			cosa = Math.cos(this.inst.angle);
		}
		
		var strokeStyles = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
		ctx.lineWidth = 2;
		
		var i, len, j, lenj, ax, ay, bx, by, poly, va, vb;
		for (i = 0, len = this.myconvexpolys.length; i < len; i++)
		{
			poly = this.myconvexpolys[i];
			ctx.strokeStyle = strokeStyles[i];
			
			for (j = 0, lenj = poly.length; j < lenj; j++)
			{
				va = poly[j];
				vb = poly[(j + 1) % lenj];
				
				ax = va.x / worldScale;
				ay = va.y / worldScale;
				bx = vb.x / worldScale;
				by = vb.y / worldScale;
				
				ctx.beginPath();
				ctx.moveTo(((ax * cosa) - (ay * sina)) + midx, ((ay * cosa) + (ax * sina)) + midy);
				ctx.lineTo(((bx * cosa) - (by * sina)) + midx, ((by * cosa) + (bx * sina)) + midy);
				ctx.stroke();
				ctx.closePath();
			}
		}
	};
	*/
	
	behinstProto.tick = function ()
	{
		if (!this.enabled)
			return;
		
		var inst = this.inst;
		var dt;
		if (this.behavior.steppingMode === 0)		// fixed
			dt = this.runtime.timescale / 60;
		else
		{
			dt = this.runtime.getDt(this.inst);
			
			// Cap step at 30 FPS, otherwise instability can result
			if (dt > 1 / 30)
				dt = 1 / 30;
		}
		
		// A new step is necessary.
		// Don't step at all if the game is paused (timescale is zero).
		if (this.runtime.tickcount > this.behavior.lastUpdateTick && this.runtime.timescale > 0)
		{
			/**PREVIEWONLY**/var start_time = cr.performance_now();
			
			this.world.Step(dt, this.behavior.velocityIterations, this.behavior.positionIterations);		// still apply timescale
			
			this.world.ClearForces();
			
			/**PREVIEWONLY**/cr.physics_cpu_time.add(cr.performance_now() - start_time);
			
			this.behavior.lastUpdateTick = this.runtime.tickcount;
		}
		
		// Size, body, animation frame or tilemap has has changed: recreate body
		if (this.recreateBody || inst.width !== this.lastWidth || inst.height !== this.lastHeight
			|| inst.cur_animation !== this.lastAnimation || inst.cur_frame !== this.lastAnimationFrame
			|| (inst.tilemap_exists && inst.physics_changed))
		{
			this.createBody();
			this.recreateBody = false;
			this.lastAnimation = inst.cur_animation;
			this.lastAnimationFrame = inst.cur_frame;
			
			if (inst.tilemap_exists && inst.physics_changed)
				inst.physics_changed = false;
		}
		
		// Something has changed the object (an event or other behavior): update the body
		var pos_changed = (inst.x !== this.lastKnownX || inst.y !== this.lastKnownY);
		var angle_changed = (inst.angle !== this.lastKnownAngle);
		
		if (pos_changed)
		{
			inst.update_bbox();
			var newmidx = inst.bquad.midX();
			var newmidy = inst.bquad.midY();
			var diffx = newmidx - this.lastKnownX;
			var diffy = newmidy - this.lastKnownY;
			this.body.SetPosition(b2Vec2.Get(newmidx * worldScale, newmidy * worldScale));
			this.body.SetLinearVelocity(b2Vec2.Get(diffx, diffy));
			this.lastTickOverride = true;
			this.body.SetAwake(true);
		}
		// clean up residual velocity if something else is controlling the object and it has now stopped
		else if (this.lastTickOverride)
		{
			this.lastTickOverride = false;
			this.body.SetLinearVelocity(b2Vec2.Get(0, 0));
			this.body.SetPosition(b2Vec2.Get(inst.bquad.midX() * worldScale, inst.bquad.midY() * worldScale));
		}
		
		if (angle_changed)
		{
			this.body.SetAngle(inst.angle);
			this.body.SetAwake(true);
		}
		
		// Update position and angle of the object from the body
		var pos = this.body.GetPosition();
		var newx = pos.x / worldScale;
		var newy = pos.y / worldScale;
		var newangle = this.body.GetAngle();
		
		if (newx !== inst.x || newy !== inst.y || newangle !== inst.angle)
		{
			inst.x = newx;
			inst.y = newy;
			inst.angle = newangle;
			inst.set_bbox_changed();
			
			// The body position is the midpoint of the object, but the hotspot might not be
			// at the mid point.  Calculate the new mid-point of the object, and offset the
			// instance's x and y position by that much.
			inst.update_bbox();
			var dx = inst.bquad.midX() - inst.x;
			var dy = inst.bquad.midY() - inst.y;
			
			if (dx !== 0 || dy !== 0)
			{
				inst.x -= dx;
				inst.y -= dy;
				inst.set_bbox_changed();
			}
		}
		
		this.lastKnownX = inst.x;
		this.lastKnownY = inst.y;
		this.lastKnownAngle = inst.angle;
	};
	
	behinstProto.getInstImgPointX = function(imgpt)
	{
		if (imgpt === -1 || !this.inst.getImagePoint)
			return this.inst.x;
			
		// use center of mass instead of origin
		if (imgpt === 0 && this.body)
			return (this.body.GetPosition().x + this.body.GetLocalCenter().x) / worldScale;
		
		return this.inst.getImagePoint(imgpt, true);
	};
	
	behinstProto.getInstImgPointY = function(imgpt)
	{
		if (imgpt === -1 || !this.inst.getImagePoint)
			return this.inst.y;
			
		// use center of mass instead of origin
		if (imgpt === 0 && this.body)
			return (this.body.GetPosition().y + this.body.GetLocalCenter().y) / worldScale;
		
		return this.inst.getImagePoint(imgpt, false);
	};
	
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		var props = [
				{"name": "Enabled", "value": this.enabled},
				{"name": "Immovable", "value": this.immovable},
				{"name": "Density", "value": this.density},
				{"name": "Friction", "value": this.friction},
				{"name": "Elasticity", "value": this.restitution},
				{"name": "Linear damping", "value": this.linearDamping},
				{"name": "Angular damping", "value": this.angularDamping}
			];
		
		if (this.enabled)
		{
			props.push({"name": "Sleeping", "value": !this.body.IsAwake(), "readonly": true});
			props.push({"name": "Velocity X", "value": this.body.GetLinearVelocity().x / worldScale});
			props.push({"name": "Velocity Y", "value": this.body.GetLinearVelocity().y / worldScale});
			props.push({"name": "Angular velocity", "value": cr.to_degrees(this.body.GetAngularVelocity())});
			props.push({"name": "Mass", "value": this.body.GetMass() / worldScale, "readonly": true});
		}
		
		propsections.push({
			"title": this.type.name,
			"properties": props
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
	{
		switch (name) {
		case "Immovable":
			this.immovable = value;
			
			if (this.enabled)
			{
				this.body.SetType(this.immovable ? 0 /*b2BodyDef.b2_staticBody*/ : 2 /*b2BodyDef.b2_dynamicBody*/);
				this.body.SetAwake(true);
			}
			break;
		case "Density":
			this.density = value;
			this.recreateBody = true;
			break;
		case "Friction":
			this.friction = value;
			this.recreateBody = true;
			break;
		case "Elasticity":
			this.restitution = value;
			this.recreateBody = true;
			break;
		case "Linear damping":
			this.linearDamping = value;
			
			if (this.enabled)
				this.body.SetLinearDamping(this.linearDamping);
			break;
		case "Angular damping":
			this.angularDamping = value;
			
			if (this.enabled)
				this.body.SetAngularDamping(this.angularDamping);
			break;
		case "Velocity X":
			if (this.enabled)
			{
				this.body.SetLinearVelocity(b2Vec2.Get(value * worldScale, this.body.GetLinearVelocity().y));
				this.body.SetAwake(true);
			}
			break;
		case "Velocity Y":
			if (this.enabled)
			{
				this.body.SetLinearVelocity(b2Vec2.Get(this.body.GetLinearVelocity().x, value * worldScale));
				this.body.SetAwake(true);
			}
			break;
		case "Angular velocity":
			if (this.enabled)
			{
				this.body.SetAngularVelocity(cr.to_radians(value));
				this.body.SetAwake(true);
			}
			break;
		case "Enabled":
			if (this.enabled && !value)
			{
				this.destroyBody();
				this.enabled = false;
			}
			else if (!this.enabled && value)
			{
				this.enabled = true;
				this.createBody();
			}
		}
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.IsSleeping = function ()
	{
		if (!this.enabled)
			return false;
		
		return !this.body.IsAwake();
	};
	
	Cnds.prototype.CompareVelocity = function (which_, cmp_, x_)
	{
		if (!this.enabled)
			return false;
		
		var velocity_vec = this.body.GetLinearVelocity();
		var v, vx, vy;
		
		if (which_ === 0)		// X velocity
			v = velocity_vec.x / worldScale;
		else if (which_ === 1)	// Y velocity
			v = velocity_vec.y / worldScale;
		else					// Overall velocity
		{
			vx = velocity_vec.x / worldScale;
			vy = velocity_vec.y / worldScale;
			v = cr.distanceTo(0, 0, vx, vy);
		}
		
		return cr.do_cmp(v, cmp_, x_);
	};
	
	Cnds.prototype.CompareAngularVelocity = function (cmp_, x_)
	{
		if (!this.enabled)
			return false;
		
		var av = cr.to_degrees(this.body.GetAngularVelocity());
		return cr.do_cmp(av, cmp_, x_);
	};
	
	Cnds.prototype.CompareMass = function (cmp_, x_)
	{
		if (!this.enabled)
			return false;
		
		var mass = this.body.GetMass() / worldScale;
		return cr.do_cmp(mass, cmp_, x_);
	};
	
	Cnds.prototype.IsEnabled = function ()
	{
		return this.enabled;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ApplyForce = function (fx, fy, imgpt)
	{
		if (!this.enabled)
			return;
		
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		this.body.ApplyForce(b2Vec2.Get(fx, fy), b2Vec2.Get(x * worldScale, y * worldScale));
	};
	
	Acts.prototype.ApplyForceToward = function (f, px, py, imgpt)
	{
		if (!this.enabled)
			return;
		
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		var a = cr.angleTo(x, y, px, py);
		this.body.ApplyForce(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
	};
	
	Acts.prototype.ApplyForceAtAngle = function (f, a, imgpt)
	{
		if (!this.enabled)
			return;
		
		a = cr.to_radians(a);
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);		
		this.body.ApplyForce(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
	};
	
	Acts.prototype.ApplyImpulse = function (fx, fy, imgpt)
	{
		if (!this.enabled)
			return;
		
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		this.body.ApplyImpulse(b2Vec2.Get(fx, fy), b2Vec2.Get(x * worldScale, y * worldScale));
		
		// Disable velocity overrides from using 'set position'
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	
	Acts.prototype.ApplyImpulseToward = function (f, px, py, imgpt)
	{
		if (!this.enabled)
			return;
		
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		var a = cr.angleTo(x, y, px, py);
		this.body.ApplyImpulse(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
		
		// Disable velocity overrides from using 'set position'
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	
	Acts.prototype.ApplyImpulseAtAngle = function (f, a, imgpt)
	{
		if (!this.enabled)
			return;
		
		a = cr.to_radians(a);
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);		
		this.body.ApplyImpulse(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
		
		// Disable velocity overrides from using 'set position'
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	
	Acts.prototype.ApplyTorque = function (m)
	{
		if (!this.enabled)
			return;
		
		this.body.ApplyTorque(cr.to_radians(m));
	};
	
	Acts.prototype.ApplyTorqueToAngle = function (m, a)
	{
		if (!this.enabled)
			return;
		
		m = cr.to_radians(m);
		a = cr.to_radians(a);
		
		// instance is clockwise of angle to apply torque toward: apply reverse torque
		if (cr.angleClockwise(this.inst.angle, a))
			this.body.ApplyTorque(-m);
		else
			this.body.ApplyTorque(m);
	};
	
	Acts.prototype.ApplyTorqueToPosition = function (m, x, y)
	{
		if (!this.enabled)
			return;
		
		m = cr.to_radians(m);
		var a = cr.angleTo(this.inst.x, this.inst.y, x, y);
		
		// instance is clockwise of angle to apply torque toward: apply reverse torque
		if (cr.angleClockwise(this.inst.angle, a))
			this.body.ApplyTorque(-m);
		else
			this.body.ApplyTorque(m);
	};
	
	Acts.prototype.SetAngularVelocity = function (v)
	{
		if (!this.enabled)
			return;
		
		this.body.SetAngularVelocity(cr.to_radians(v));
		this.body.SetAwake(true);
	};
	
	Acts.prototype.CreateDistanceJoint = function (imgpt, obj, objimgpt, damping, freq)
	{
		if (!obj || !this.enabled)
			return;
			
		var otherinst = obj.getFirstPicked(this.inst);
		
		if (!otherinst || otherinst == this.inst)
			return;
		if (!otherinst.extra.box2dbody)
			return;		// no physics behavior on other object
		
		this.myCreatedJoints.push({type: 0, params: [imgpt, otherinst.uid, objimgpt, damping, freq]});
		this.doCreateDistanceJoint(imgpt, otherinst.uid, objimgpt, damping, freq);
	};
	
	behinstProto.doCreateDistanceJoint = function (imgpt, otherinstuid, objimgpt, damping, freq)
	{
		if (!this.enabled)
			return;
		
		var otherinst = this.runtime.getObjectByUID(otherinstuid);
		
		if (!otherinst || otherinst == this.inst || !otherinst.extra.box2dbody)
			return;
			
		otherinst.extra.box2dbody.c2userdata.joiningMe.add(this.inst);
		
		var myx = this.getInstImgPointX(imgpt);
		var myy = this.getInstImgPointY(imgpt);
		var theirx, theiry;
		
		if (otherinst.getImagePoint)
		{
			theirx = otherinst.getImagePoint(objimgpt, true);
			theiry = otherinst.getImagePoint(objimgpt, false);
		}
		else
		{
			theirx = otherinst.x;
			theiry = otherinst.y;
		}
		
		var dx = myx - theirx;
		var dy = myy - theiry;
		
		var jointDef = new b2DistanceJointDef();
		jointDef.Initialize(this.body, otherinst.extra.box2dbody, b2Vec2.Get(myx * worldScale, myy * worldScale), b2Vec2.Get(theirx * worldScale, theiry * worldScale));
		jointDef.length = Math.sqrt(dx*dx + dy*dy) * worldScale;
		jointDef.dampingRatio = damping;
		jointDef.frequencyHz = freq;
		this.myJoints.push(this.world.CreateJoint(jointDef));
	};
	
	Acts.prototype.CreateRevoluteJoint = function (imgpt, obj)
	{
		if (!obj || !this.enabled)
			return;
			
		var otherinst = obj.getFirstPicked(this.inst);
		
		if (!otherinst || otherinst == this.inst)
			return;
		if (!otherinst.extra.box2dbody)
			return;		// no physics behavior on other object
		
		this.myCreatedJoints.push({type: 1, params: [imgpt, otherinst.uid]});
		this.doCreateRevoluteJoint(imgpt, otherinst.uid);
	};
	
	behinstProto.doCreateRevoluteJoint = function (imgpt, otherinstuid)
	{
		if (!this.enabled)
			return;
		
		var otherinst = this.runtime.getObjectByUID(otherinstuid);
		
		if (!otherinst || otherinst == this.inst || !otherinst.extra.box2dbody)
			return;
			
		otherinst.extra.box2dbody.c2userdata.joiningMe.add(this.inst);
		
		var myx = this.getInstImgPointX(imgpt);
		var myy = this.getInstImgPointY(imgpt);
		
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(this.body, otherinst.extra.box2dbody, b2Vec2.Get(myx * worldScale, myy * worldScale));
		this.myJoints.push(this.world.CreateJoint(jointDef));
	};
	
	Acts.prototype.CreateLimitedRevoluteJoint = function (imgpt, obj, lower, upper)
	{
		if (!obj || !this.enabled)
			return;
			
		var otherinst = obj.getFirstPicked(this.inst);
		
		if (!otherinst || otherinst == this.inst)
			return;
		if (!otherinst.extra.box2dbody)
			return;		// no physics behavior on other object
		
		this.myCreatedJoints.push({type: 2, params: [imgpt, otherinst.uid, lower, upper]});
		this.doCreateLimitedRevoluteJoint(imgpt, otherinst.uid, lower, upper);
	};
	
	behinstProto.doCreateLimitedRevoluteJoint = function (imgpt, otherinstuid, lower, upper)
	{
		if (!this.enabled)
			return;
		
		var otherinst = this.runtime.getObjectByUID(otherinstuid);
		
		if (!otherinst || otherinst == this.inst || !otherinst.extra.box2dbody)
			return;
			
		otherinst.extra.box2dbody.c2userdata.joiningMe.add(this.inst);
		
		var myx = this.getInstImgPointX(imgpt);
		var myy = this.getInstImgPointY(imgpt);
		
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(this.body, otherinst.extra.box2dbody, b2Vec2.Get(myx * worldScale, myy * worldScale));
		jointDef.enableLimit = true;
		jointDef.lowerAngle = cr.to_radians(lower);
		jointDef.upperAngle = cr.to_radians(upper);
		this.myJoints.push(this.world.CreateJoint(jointDef));
	};
	
	Acts.prototype.SetWorldGravity = function (g)
	{
		if (g === this.behavior.worldG)
			return;
		
		this.world.SetGravity(b2Vec2.Get(0, g));
		this.behavior.worldG = g;
		
		// Wake up every physics instance
		var i, len, arr = this.behavior.my_instances.valuesRef();
		
		for (i = 0, len = arr.length; i < len; i++)
		{
			if (arr[i].extra.box2dbody)
				arr[i].extra.box2dbody.SetAwake(true);
		}
	};
	
	Acts.prototype.SetSteppingMode = function (mode)
	{
		this.behavior.steppingMode = mode;
	};
	
	Acts.prototype.SetIterations = function (vel, pos)
	{
		if (vel < 1) vel = 1;
		if (pos < 1) pos = 1;
		
		this.behavior.velocityIterations = vel;
		this.behavior.positionIterations = pos;
	};
	
	Acts.prototype.SetVelocity = function (vx, vy)
	{
		if (!this.enabled)
			return;
		
		this.body.SetLinearVelocity(b2Vec2.Get(vx * worldScale, vy * worldScale));
		this.body.SetAwake(true);
		
		// Disable velocity overrides from using 'set position'
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	
	Acts.prototype.SetDensity = function (d)
	{
		if (!this.enabled)
			return;
		
		if (this.density === d)
			return;
			
		this.density = d;
		this.recreateBody = true;
	};
	
	Acts.prototype.SetFriction = function (f)
	{
		if (!this.enabled)
			return;
		
		if (this.friction === f)
			return;
			
		this.friction = f;
		this.recreateBody = true;
	};
	
	Acts.prototype.SetElasticity = function (e)
	{
		if (!this.enabled)
			return;
		
		if (this.restitution === e)
			return;
			
		this.restitution = e;
		this.recreateBody = true;
	};
	
	Acts.prototype.SetLinearDamping = function (ld)
	{
		if (!this.enabled)
			return;
		
		if (this.linearDamping === ld)
			return;
			
		this.linearDamping = ld;
		this.body.SetLinearDamping(ld);
	};
	
	Acts.prototype.SetAngularDamping = function (ad)
	{
		if (!this.enabled)
			return;
		
		if (this.angularDamping === ad)
			return;
			
		this.angularDamping = ad;
		this.body.SetAngularDamping(ad);
	};
	
	Acts.prototype.SetImmovable = function (i)
	{
		if (!this.enabled)
			return;
		
		if (this.immovable === (i !== 0))
			return;
			
		this.immovable = (i !== 0);
		this.body.SetType(this.immovable ? 0 /*b2BodyDef.b2_staticBody*/ : 2 /*b2BodyDef.b2_dynamicBody*/);
		this.body.SetAwake(true);
	};
	
	function SetCollisionsEnabled(typeA, typeB, state)
	{
		var s;
		
		// Enable collisions between A and B
		if (state)
		{
			s = typeA.extra["Physics_DisabledCollisions"];
			
			if (s)
				s.remove(typeB);
				
			s = typeB.extra["Physics_DisabledCollisions"];
			
			if (s)
				s.remove(typeA);
		}
		// Disable collisions between A and B
		else
		{
			if (!typeA.extra["Physics_DisabledCollisions"])
				typeA.extra["Physics_DisabledCollisions"] = new cr.ObjectSet();
				
			typeA.extra["Physics_DisabledCollisions"].add(typeB);
			
			if (!typeB.extra["Physics_DisabledCollisions"])
				typeB.extra["Physics_DisabledCollisions"] = new cr.ObjectSet();
				
			typeB.extra["Physics_DisabledCollisions"].add(typeA);
		}
	};
	
	Acts.prototype.EnableCollisions = function (obj, state)
	{
		if (!obj || !this.enabled)
			return;
			
		var i, len;
			
		// If passed a family, set the collisions enabled for the members directly instead of on the family		
		if (obj.is_family)
		{
			for (i = 0, len = obj.members.length; i < len; i++)
			{
				SetCollisionsEnabled(this.inst.type, obj.members[i], state !== 0);
			}
		}
		else
		{
			SetCollisionsEnabled(this.inst.type, obj, state !== 0);
		}
		
		// Turn off the fast response to ShouldCollide optimisation
		this.behavior.allCollisionsEnabled = false;
	};
	
	Acts.prototype.SetPreventRotate = function (i)
	{
		if (!this.enabled)
			return;
		
		if (this.preventRotation === (i !== 0))
			return;
			
		this.preventRotation = (i !== 0);
		this.body.SetFixedRotation(this.preventRotation);
		this.body.m_torque = 0;
		this.body.SetAngularVelocity(0);
		this.body.SetAwake(true);
	};
	
	Acts.prototype.SetBullet = function (i)
	{
		if (!this.enabled)
			return;
		
		if (this.bullet === (i !== 0))
			return;
			
		this.bullet = (i !== 0);
		this.body.SetBullet(this.bullet);
		this.body.SetAwake(true);
	};
	
	Acts.prototype.RemoveJoints = function ()
	{
		if (!this.enabled)
			return;
		
		this.destroyMyJoints();	
		this.myCreatedJoints.length = 0;	
		this.joiningMe.clear();
	};
	
	Acts.prototype.SetEnabled = function (e)
	{
		// Is enabled, and setting disabled
		if (this.enabled && e === 0)
		{
			this.destroyBody();
			this.enabled = false;
		}
		// Is disabled, and setting enabled
		else if (!this.enabled && e === 1)
		{
			this.enabled = true;
			this.createBody();
		}
	};
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.VelocityX = function (ret)
	{
		ret.set_float(this.enabled ? this.body.GetLinearVelocity().x / worldScale : 0);
	};
	
	Exps.prototype.VelocityY = function (ret)
	{
		ret.set_float(this.enabled ? this.body.GetLinearVelocity().y / worldScale : 0);
	};
	
	Exps.prototype.AngularVelocity = function (ret)
	{
		ret.set_float(this.enabled ? cr.to_degrees(this.body.GetAngularVelocity()) : 0);
	};
	
	Exps.prototype.Mass = function (ret)
	{
		ret.set_float(this.enabled ? this.body.GetMass() / worldScale : 0);
	};
	
	Exps.prototype.CenterOfMassX = function (ret)
	{
		ret.set_float(this.enabled ? (this.body.GetPosition().x + this.body.GetLocalCenter().x) / worldScale : 0);
	};
	
	Exps.prototype.CenterOfMassY = function (ret)
	{
		ret.set_float(this.enabled ? (this.body.GetPosition().y + this.body.GetLocalCenter().y) / worldScale : 0);
	};
	
	Exps.prototype.Density = function (ret)
	{
		ret.set_float(this.enabled ? this.density : 0);
	};
	
	Exps.prototype.Friction = function (ret)
	{
		ret.set_float(this.enabled ? this.friction : 0);
	};
	
	Exps.prototype.Elasticity = function (ret)
	{
		ret.set_float(this.enabled ? this.restitution : 0);
	};
	
	Exps.prototype.LinearDamping = function (ret)
	{
		ret.set_float(this.enabled ? this.linearDamping : 0);
	};
	
	Exps.prototype.AngularDamping = function (ret)
	{
		ret.set_float(this.enabled ? this.angularDamping : 0);
	};
	
	behaviorProto.exps = new Exps();
	
}());