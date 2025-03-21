package com.conkiri.domain.sharing.entity;

import com.conkiri.domain.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ScrapSharing {

	@Id
	@Column(name = "scrap_sharing_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long scrapSharingId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sharing_id")
	private Sharing sharing;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User user;

	public static ScrapSharing of(Sharing sharing, User user) {
		return new ScrapSharing(sharing, user);
	}

	private ScrapSharing(Sharing sharing, User user) {
		this.sharing = sharing;
		this.user = user;
	}
}
